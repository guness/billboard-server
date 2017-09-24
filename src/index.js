import dva from 'dva';
import { message } from 'antd'
import './styles/index.less';
import 'babel-polyfill'

// 1. Initialize
const app = dva({
    onError (error) {
        message.error(error.message)
    },
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/app'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');