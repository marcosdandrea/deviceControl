const events = require("events");
const crypto = require("crypto");

const taskEvents = Object.freeze({
  enabled: "ENABLED",
  disabled: "DISABLED",
  completed: "COMPLETED",
  jobSetted: "JOB_SETTED",
  conditionSetted: "CONDITION_SETTED",
  started: "STARTED",
  failed: "FAILED",
  retry: "RETRY",
  aborted: "ABORTED",
});

class Task extends events {
  retry = 0;

  /**
   *
   * @param {function} job
   * @param {function} condition
   * @param {string} name
   * @param {number} retryTimeout
   */

  constructor({
    job,
    condition,
    name,
    retryTimeout,
    retries,
    jobArgs,
    conditionArgs,
  }) {
    if (typeof job !== "function") throw new Error("Job must be a function");

    if (condition && typeof condition !== "function")
      throw new Error("Condition must be a function");

    if (name && typeof name !== "string")
      throw new Error("Name must be a string");

    if ((condition && typeof retryTimeout !== "number") || retryTimeout < 20)
      throw new Error(
        "Retry timeout must be a positive number greater than 20 (ms)"
      );

    super();
    this._id = crypto.randomUUID();
    this.name = name || undefined;
    this.job = job;
    this.condition = condition || undefined;
    this.completed = false;
    this.enabled = false;
    this.failed = false;
    this.retryies = retries || 1;
    this.retryTimeout = retryTimeout || 20;
    this.jobArgs = jobArgs || {};
    this.conditionArgs = conditionArgs || {};
    this.shouldAbort = false
  }

  #eventDispatcher(event, value) {
    this.emit(event, value);
  }

  enable() {
    this.enabled = true;
    this.#eventDispatcher(taskEvents.enabled);
  }

  disable() {
    this.enabled = false;
    this.#eventDispatcher(taskEvents.disabled);
  }

  setJob(job) {
    if (typeof job !== "function") throw new Error("Job must be a function");

    this.job = job;
    this.#eventDispatcher(taskEvents.jobSetted);
  }

  setCondition(condition) {
    if (typeof condition !== "function")
      throw new Error("Condition must be a function");

    this.condition = condition;
    this.#eventDispatcher(taskEvents.conditionSetted);
  }

  #resetTaskState() {
    this.shouldAbort = false
    this.failed = false;
    this.completed = false;
    this.retry = 0;
  }

  async run() {
    const jobArgError = this.#validateJobArgs();
    if (jobArgError) throw jobArgError;

    const conditionArgError = this.#validateConditionArgs();
    if (conditionArgError) throw conditionArgError;

    return new Promise(async (resolve, reject) => {
      this.#resetTaskState();
      this.#eventDispatcher(taskEvents.started);
      try {
        const value = await this.#runJob();
        resolve(value);
      } catch (e) {
        this.failed = true;
        this.#eventDispatcher(taskEvents.failed, e);
        reject(e);
      }
    });
  }

  abortTask() {
    this.shouldAbort = true;
  }

  async checkCondition() {
    return await this.condition.run(this.conditionArgs);
  }


  #runJob() {

    return new Promise(async (resolve, reject) => {

      do {

        //if its not the first retry
        if (this.retry > 0) {
          this.#eventDispatcher(taskEvents.retry, {
            retry: this.retry,
            id: this._id,
          });
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryTimeout)
          );

          //if its the last retry
          if (this.retry >= this.retryies) {
            this.failed = true;
            break;
          }
        }

        this.retry++;

        //if this task has a condition should check it
        if (typeof this.condition == "function") {
          try {
            await this.checkCondition(this.conditionArgs);
            this.completed = true;
            break; //condition has passed, so we mark this job as completed and break the try loop
          } catch (cause) {
            this.#eventDispatcher(taskEvents.failed, cause);
          }
        }

        if (this.shouldAbort){
            this.#eventDispatcher(taskEvents.aborted)
            this.failed = true;
            break
        }

        try {
            await this.job.run(this.jobArgs);
        } catch (cause) {
            this.#eventDispatcher(taskEvents.failed, cause);
        }

        //if this task does not have a condition, it should be mark as completed
        if (typeof this.condition != "function") {
          this.completed = true;
          break;
        }
      } while (!this.completed && !this.failed);

      if (this.completed) {
        this.#eventDispatcher(taskEvents.completed);
        resolve(this.name);
      }

      if (this.failed) {
        reject(`Job Failed after ${this.retry} retries.`);
      }
    });
  }

  #validateJobArgs() {
    const requiredArgs = this.job.args();
    for (let arg of requiredArgs) {
      if (!this.jobArgs.hasOwnProperty(arg.name) && arg.required) {
        return new Error(
          `Job requires argument "${arg.name}" with type "${arg.type}"`
        );
      }
      if (typeof this.jobArgs[arg.name] !== arg.type) {
        return new Error(`Job argument "${arg.name}" must be ${arg.type}`);
      }
    }
  }

  #validateConditionArgs() {
    if (!this.condition) return false;
    const requiredArgs = this.condition.args();
    for (let arg of requiredArgs) {
      if (!this.conditionArgs.hasOwnProperty(arg.name) && arg.required) {
        return Error(
          `Condition  requires argument "${arg.name}" with type "${arg.type}"`
        );
      }
      if (typeof this.conditionArgs[arg.name] !== arg.type) {
        return Error(`Condition argument "${arg.name}" must be ${arg.type}`);
      }
    }
  }

  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      completed: this.completed,
      enabled: this.enabled,
      failed: this.failed,
      retry: this.retry,
      retryies: this.retryies,
      retryTimeout: this.retryTimeout,
      jobArgs: this.jobArgs,
      conditionArgs: this.conditionArgs,
    };
  }
}

module.exports = {
  taskEvents,
  Task,
};
