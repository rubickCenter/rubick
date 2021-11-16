<template>
  <div class="dev-plugin">
    <a-form
      class="dev-plugin-form"
      :form="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      @submit="handleSubmit"
    >
      <a-form-item label="插件文件路径">
        <div @click="selectPath">
          <a-input
            disabled
            v-decorator="['devPluginPath', { rules: [{ required: true, message: '请选择插件路径' }] }]"
          />
        </div>
      </a-form-item>
      <a-form-item label="启动命令">
        <a-input
          v-decorator="['startCmd']"
        />
      </a-form-item>
      <a-form-item label="插件类型">
        <a-select
          v-decorator="['type', {
          initialValue: 'ui'
        }]"
        >
          <a-select-option value="ui">
            ui插件
          </a-select-option>
          <a-select-option value="sys">
            全局插件
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" html-type="submit">
          运行
        </a-button>
      </a-form-item>
    </a-form>
    <div class="records"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { dialog } from '@electron/remote'

export default {
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getDevPluginDetail(values)
        }
      })
    },
    selectPath () {
      const selectPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
      if (selectPath) {
        this.form.setFieldsValue({
          devPluginPath: selectPath[0]
        })
      }
    },
    ...mapActions('search', ['getDevPluginDetail'])
  }
}
</script>
<style lang="less">
.dev-plugin {
  display: flex;
  .dev-plugin-form {
    width: 450px;
    padding-top: 20px;
    height: 100vh;
    border-right: 1px solid #ddd;
  }
}
</style>
