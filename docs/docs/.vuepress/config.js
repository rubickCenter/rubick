module.exports = {
  title: 'Rubick',
  description: '你的开源桌面插件应用',
  base: '/rubick/',
  themeConfig: {
    themeColor: {
      blue: "#2196f3",
      red: "#2196f3",
      green: "#2196f3",
      orange: "#2196f3",
    },
    logo: '/images/logo.png',
    nav: [
      { text: '使用文档', link: '/guide/' },
      { text: '开发者', link: '/dev/' },
    ],
    sidebar: [
      {
        title: '使用文档',   // 必要的
        path: '/guide/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        sidebarDepth: 1,    // 可选的, 默认值是 1
      },
      {
        title: '插件开发',
        path: '/dev/',
      },
      {
        title: 'API',
        path: '/api/',
      },
      {
        title: '贡献 rubick',
        path: '/run/',
      }
    ],
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'https://github.com/rubickCenter/rubick',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'Github',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！'
  }
}
