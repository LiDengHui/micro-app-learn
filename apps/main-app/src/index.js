import './style.scss';
import "./main.js"
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
    {
        name: 'sub-app-react',
        entry: '//localhost:7101',
        container: '#micro-content',
        activeRule: '/react',
    },
    {
        name: 'sub-app-vue',
        entry: '//localhost:7102',
        container: '#micro-content',
        activeRule: '/vue',
    }
]);

start({
    sandbox: {
        experimentalStyleIsolation: true,
    }
});

