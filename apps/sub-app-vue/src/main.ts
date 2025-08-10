import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun/dist/helper';
import type {QiankunProps} from "vite-plugin-qiankun/es/helper";


function render(props: QiankunProps) {
    const {container} = props;

    createApp(App).mount(container ?? '#app')
}

// some code
renderWithQiankun({
    mount(props) {
        console.log('mount');
        render(props);
    },
    bootstrap() {
        console.log('bootstrap');
    },
    update(props: QiankunProps) {
        return undefined;
    },
    unmount(props) {
        console.log('unmount');
        const {container} = props;
        const mountRoot = container?.querySelector('#root');

    }
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render({});
}
