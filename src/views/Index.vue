<template>
    <el-container class="index-box">
        <el-aside width="asideWidth">
            <div class="logo">
                <img v-if="!isCollapse" style="width: 180px; height: 60.82px" src="./../assets/logo.png" alt="DBMind">
                <img v-if="isCollapse" style="width: 50px; height: 50px" src="./../assets/logo_icon.png" alt="DBMind">
            </div>
            <menus :isCollapse="isCollapse"/>
        </el-aside>
        <el-container>
            <el-header>
                <headers/>
            </el-header>
            <el-main>
                <router-view v-if="isRouterAlive"/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
  import Menus from '@/components/menus/menus'
  import Headers from '@/components/header/header'

  export default {
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    components: {
      Menus,
      Headers
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      }
    },
    computed: {
      isCollapse() {
        return this.$store.state.isCollapse
      },
      asideWidth() {
        return this.$store.state.isCollapse ? 'auto' : '200px'
      }
    }
  }
</script>

<style lang="scss">
    .index-box {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        height: 100%;

        .el-container {
            height: 100%;

            .el-main {
                height: 100%;
            }
        }

        .el-aside {
            background-color: #FFFFFF;
            height: 100vh;
            min-height: 100%;

            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #FFFFFF;
                color: rgba(255, 255, 255, .8);
                text-align: center;
                height: 60px;
                box-sizing: border-box;
                border-bottom: 1px solid #f6f6f6;
            }
        }

        .el-header {
            border-bottom: 1px solid #f6f6f6;
            box-sizing: border-box;
            background-color: #fff;
            line-height: 60px;
        }
    }
</style>
