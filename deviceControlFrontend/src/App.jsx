import { Provider } from 'react-redux'
import SocketContext from './components/Socket'
import { store } from './components/Store'
import RoutineView from './Views/RoutinesView'
import LogsView from './Views/LogsView'
import ViewContextProvider, { VIEWS } from './Contexts/ViewContextProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import GetIterativeIP from './components/GetIterativeIP'

function App() {

  return (
    <Provider store={store}>
      <SocketContext>
        <GetIterativeIP/>
        <ToastContainer position='bottom-right'/>
        <ViewContextProvider>
          <RoutineView key={VIEWS.routines} />
          <LogsView key={VIEWS.logs} />
        </ViewContextProvider>
      </SocketContext>
    </Provider>
  )
}

export default App
