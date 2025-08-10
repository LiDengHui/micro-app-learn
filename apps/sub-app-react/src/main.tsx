import './public-path'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun/dist/helper';


function render(props) {
    const {container} = props;
    createRoot(container ? container.querySelector('#root')! : document.querySelector('#root')!).render(
        <StrictMode>
            <App/>
        </StrictMode>,
    );
}


renderWithQiankun({
    async mount(props: any): Promise<any> {
        render(props);
        // await props.onGlobalStateChange((state: any) => {
        // 	// console.log('子应用接收的参数', state);
        // });
        return new Promise((resolve, reject) => {
            resolve('mount')
        })
    },
    bootstrap(): Promise<any> {
        console.log('%c', 'color:green;', ' ChildOne bootstrap');
        return new Promise((resolve, reject) => {
            resolve('bootstrap');
        });
    },
    update() {
        console.log('%c', 'color:green;', ' ChildOne update');
    },
    unmount(props: any) {
        console.log('sub app vue3 unmount', props);
        // const { container } = props;
        // ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
        //   window.location.reload()
    },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render({})
}


