
const net = {
    ECONNREFUSED: "No se pudo conectar con el host especificado", // Connection was refused by the server.
    ECONNRESET: "La conexión fue restablecida por el servidor de forma abrupta", // Connection was forcibly closed by the server.
    EADDRINUSE: "La dirección ya está en uso", // The address is already in use.
    ETIMEDOUT: "La conexión ha agotado el tiempo de espera", // The connection attempt timed out.
    EHOSTUNREACH: "El host no es alcanzable", // No route to the specified host.
    ENOTFOUND: "El nombre del host no se pudo resolver", // DNS lookup failed, host not found.
    EPIPE: "La tubería se ha roto", // Broken pipe, the connection was terminated.
    ENETUNREACH: "La red no es alcanzable", // The network is unreachable.
    EAI_AGAIN: "Error temporal de resolución de DNS", // Temporary DNS resolution failure.
    EISCONN: "El socket ya está conectado", // Socket is already connected.
    ENOTCONN: "El socket no está conectado", // Socket is not connected.
    EALREADY: "Una operación ya está en curso", // Operation already in progress.
    EADDRNOTAVAIL: "La dirección solicitada no está disponible", // The requested address is not available.
    EMFILE: "Se ha alcanzado el límite de archivos abiertos", // Too many open files in the system.
    ENOBUFS: "No hay suficientes buffers disponibles", // No buffer space available.
    EPROTO: "Error de protocolo", // Protocol error.
    EBADF: "El descriptor de archivo es inválido", // Bad file descriptor.
    EFAULT: "Error de segmentación", // Bad address, segmentation fault.
    EINVAL: "Argumento inválido", // Invalid argument provided.
    ENOMEM: "Memoria insuficiente", // Insufficient memory.
    EACCES: "Permiso denegado", // Permission denied.
    EPERM: "Operación no permitida", // Operation not permitted.
    ESOCKETTIMEDOUT: "El socket ha agotado el tiempo de espera" // The socket timed out.
};

const dgram = {
    EACCES: "Permiso denegado. No se tiene acceso al recurso solicitado", // Permission denied.
    EADDRINUSE: "La dirección ya está en uso", // The address is already in use.
    EADDRNOTAVAIL: "La dirección solicitada no está disponible", // The requested address is not available.
    ECONNREFUSED: "La conexión fue rechazada por el destino", // Connection refused by the remote server.
    ECONNRESET: "La conexión fue restablecida por el servidor de forma abrupta", // Connection was forcibly closed by the peer.
    EHOSTUNREACH: "El host no es alcanzable", // No route to the specified host.
    EINTR: "La llamada al sistema fue interrumpida", // System call was interrupted.
    EINVAL: "Argumento inválido", // Invalid argument provided.
    EMSGSIZE: "El mensaje es demasiado largo", // The message is too long to be sent in a datagram.
    ENETDOWN: "La red está inactiva", // The network is down.
    ENETUNREACH: "La red no es alcanzable", // The network is unreachable.
    ENOBUFS: "No hay suficientes buffers disponibles", // No buffer space available.
    ENOMEM: "Memoria insuficiente", // Not enough memory.
    ENOTCONN: "El socket no está conectado", // The socket is not connected.
    ENOTSOCK: "El descriptor no corresponde a un socket", // The descriptor is not a socket.
    EPROTO: "Error de protocolo", // Protocol error.
    EFAULT: "Dirección de memoria inválida", // Bad address.
    EWOULDBLOCK: "La operación bloquearía, pero el socket está en modo no bloqueante", // Operation would block.
    ETIMEDOUT: "La operación ha agotado el tiempo de espera", // Operation timed out.
    EPIPE: "La tubería se ha roto", // Broken pipe.
    EISCONN: "El socket ya está conectado", // The socket is already connected.
    EBADF: "El descriptor de archivo es inválido", // Bad file descriptor.
    ESOCKTNOSUPPORT: "El tipo de socket no es compatible", // Socket type is not supported.
    ENOPROTOOPT: "La opción de protocolo no está disponible", // Protocol option not available.
    EALREADY: "Una operación ya está en curso", // Operation already in progress.
    EPERM: "Operación no permitida", // Operation not permitted.
    ESOCKETTIMEDOUT: "El socket ha agotado el tiempo de espera" // The socket timed out.
};


module.exports = {
    net, dgram
}