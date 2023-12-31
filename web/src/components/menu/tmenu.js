import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

const { Item, SubMenu } = Menu

export default {
  name: 'TMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: [],
      isLogin: false
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  created() {
    this.isLogin = this.$store.getters.userInfo != null;
  },
  mounted() {
    // this.updateMenu()
  },
  watch: {
    collapsed(val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      // this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange(openKeys) {

      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    // updateMenu() {
    //   const routes = this.$route.matched.concat()
    //   const { hidden } = this.$route.meta
    //   if (routes.length >= 3 && hidden) {
    //     routes.pop()
    //     this.selectedKeys = [routes[routes.length - 1].path]
    //   } else {
    //     this.selectedKeys = [routes.pop().path]
    //   }
    //   const openKeys = []
    //   if (this.mode === 'inline') {
    //     routes.forEach(item => {
    //       openKeys.push(item.path)
    //     })
    //   }
    //   //update-begin-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
    //   if (!this.selectedKeys || this.selectedKeys[0].indexOf(":") < 0) {
    //     this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    //   }
    //   //update-end-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
    // },

    // render
    renderItem(menu) {
      if (!menu.hidden) {
        return menu.children ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem(menu) {
      const tag = (menu.route && !menu.internalOrExternal) ? 'router-link' : 'a'
      const target = menu.internalOrExternal ? "_blank" : "_self"
      const props = { to: { path: menu.url } }
      const attrs = { href: menu.url, target: target }

      if(menu.needLogin && !this.isLogin){
        return
      }
      return (
        <Item {...{ key: menu.id }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.icon)}
            <span>{menu.title}</span>
          </tag>
        </Item>
      )
    },
    renderSubMenu(menu) {
      const tag = (menu.route && !menu.internalOrExternal) ? 'router-link' : 'a'
      const props = { to: { path: menu.url } }
      const target = menu.internalOrExternal ? "_blank" : "_self"
      const attrs = { href: menu.url, target: target}
      const itemArr = []
      menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      return (
        <SubMenu {...{ key: menu.id }}>
          <tag slot="title" {...{props, attrs}}>
            {this.renderIcon(menu.icon)}
            <span>{menu.title}</span>
          </tag>
          {itemArr}
        </SubMenu>
      )
    },
    renderIcon(icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      return (
        <Icon {... { props }} />
      )
    }
  },

  render() {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys,
      overflowedIndicator: <a-icon style="color:white" type="menu"/>
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }

    const menuTree = menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    // {...{ props, on: on }}
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
