<template>
    <el-menu
            class="menu-nav"
            router
            :default-active="currentPath"
            text-color="#666666"
            active-text-color="#409EFF"
            :collapse="isCollapse">
        <el-menu-item index="/dashboard">
            <i class="el-icon-odometer"></i>
            <span slot="title">Monitoring Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/design">
            <i class="el-icon-cpu"></i>
            <span slot="title">数据库智能设计</span>
        </el-menu-item>
        <el-menu-item index="/optimization">
            <i class="el-icon-magic-stick"></i>
            <span slot="title">性能优化</span>
        </el-menu-item>
        <el-menu-item index="/sql_diagnose">
            <i class="el-icon-first-aid-kit"></i>
            <span slot="title">SQL诊断与调优</span>
        </el-menu-item>
        <el-menu-item index="/db_security">
            <i class="el-icon-lock"></i>
            <span slot="title">数据库安全</span>
        </el-menu-item>
        <el-menu-item index="/dbai">
            <i class="el-icon-trophy"></i>
            <span slot="title">AI&DB联合优化</span>
        </el-menu-item>
        <el-menu-item index="/performance">
            <i class="el-icon-printer"></i>
            <span slot="title">数据库性能测试</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
  export default {
    props: ['isCollapse'],
    data() {
      return {
        currentPath: location.pathname
      }
    }
  }
</script>

<style lang="scss" scoped>
    .el-menu {
        border: none;
    }

    .menu-nav:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>
