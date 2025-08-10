const menuData = [
    {
        title: 'react子应用',
        children: [
            { title: 'sub-app-react', moduleUrl: '/react' },
        ]
    },
    {
        title: 'vue 子应用',
        children: [
            { title: '订单列表', moduleUrl: '/vue' }
        ]
    },
    {
        title: '系统设置',
        children: [
            { title: '基础设置', moduleUrl: 'https://example.com/settings' },
            { title: '安全中心', moduleUrl: 'https://example.com/security' }
        ]
    }
];

const menuContainer = document.getElementById('menu-container');
const contentContainer = document.getElementById('micro-content');

menuData.forEach(item => {
    const group = document.createElement('div');
    group.className = 'menu-group';

    const groupTitle = document.createElement('div');
    groupTitle.className = 'group-title';
    groupTitle.textContent = item.title;

    const submenu = document.createElement('div');
    submenu.className = 'submenu';

    item.children.forEach(child => {
        const submenuItem = document.createElement('div');
        submenuItem.className = 'submenu-item';
        submenuItem.textContent = child.title;
        submenuItem.dataset.moduleUrl = child.moduleUrl;

        submenu.appendChild(submenuItem);
    });

    group.appendChild(groupTitle);
    group.appendChild(submenu);
    menuContainer.appendChild(group);
});

// 点击子菜单加载 iframe 内容
menuContainer.addEventListener('click', e => {
    const target = e.target;
    if (target.classList.contains('submenu-item')) {
        const url = target.dataset.moduleUrl;
        history.replaceState({page: window.location.pathname},'', url);
    }
});
