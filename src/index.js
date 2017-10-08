import dva from 'dva';
import { message } from 'antd'
import './styles/index.less';
import 'babel-polyfill'
import createLoading from 'dva-loading';


// 1. Initialize
const app = dva({
    ...createLoading({
        effects: true,
    }),
    onError (error) {
        message.error(error.message)
    },
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/app'));
app.model(require('./models/device'));
app.model(require('./models/group'));
app.model(require('./models/media'));
app.model(require('./models/playlist'));
app.model(require('./models/relations'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');