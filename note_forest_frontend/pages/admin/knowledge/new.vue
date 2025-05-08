<script setup lang="ts">
import useThemeStore from "~/store/themeStore";

definePageMeta({
  layout: 'empty',
  layoutTransition: {
    name: 'layout-fade'
  }
});

import {type ConfigOption, MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {config as mdEditorConfig} from "md-editor-v3"
import userStore from "~/store/userStore";

const router = useRouter()
const themeStore = useThemeStore()

mdEditorConfig({
  editorConfig: {
    languageUserDefined: {
      'cn': {
        toolbarTips: {
          bold: '加粗',
          underline: '下划线',
          italic: '斜体',
          strikeThrough: '删除线',
          title: '标题',
          sub: '下标',
          sup: '上标',
          quote: '引用',
          unorderedList: '无序列表',
          orderedList: '有序列表',
          task: '任务列表',
          codeRow: '行内代码',
          code: '块级代码',
          link: '链接',
          image: '图片',
          table: '表格',
          mermaid: 'mermaid图',
          katex: 'katex公式',
          revoke: '后退',
          next: '前进',
          save: '保存',
          prettier: '美化',
          pageFullscreen: '浏览器全屏',
          fullscreen: '屏幕全屏',
          preview: '预览',
          htmlPreview: 'html代码预览',
          catalog: '目录',
          github: '源码地址',
        },
        titleItem: {
          h1: '一级标题',
          h2: '二级标题',
          h3: '三级标题',
          h4: '四级标题',
          h5: '五级标题',
          h6: '六级标题',
        },
        imgTitleItem: {
          link: '添加链接',
          upload: '上传图片',
          clip2upload: '裁剪上传',
        },
        linkModalTips: {
          linkTitle: '添加链接',
          imageTitle: '添加图片',
          descLabel: '链接描述：',
          descLabelPlaceHolder: '请输入描述...',
          urlLabel: '链接地址：',
          urlLabelPlaceHolder: '请输入链接...',
          buttonOK: '确定',
        },
        clipModalTips: {
          title: '裁剪图片上传',
          buttonUpload: '上传',
        },
        copyCode: {
          text: '复制代码',
          successTips: '已复制！',
          failTips: '复制失败！',
        },
        mermaid: {
          flow: '流程图',
          sequence: '时序图',
          gantt: '甘特图',
          class: '类图',
          state: '状态图',
          pie: '饼图',
          relationship: '关系图',
          journey: '旅程图',
        },
        katex: {
          inline: '行内公式',
          block: '块级公式',
        },
        footer: {
          markdownTotal: '字数',
          scrollAuto: '同步滚动',
        },
      },
      'en': {
        toolbarTips: {
          bold: 'Bold',
          underline: 'Underline',
          italic: 'Italic',
          strikeThrough: 'Strikethrough',
          title: 'Title',
          sub: 'Subscript',
          sup: 'Superscript',
          quote: 'Blockquote',
          unorderedList: 'Unordered List',
          orderedList: 'Ordered List',
          task: 'Task List',
          codeRow: 'Inline Code',
          code: 'Code Block',
          link: 'Link',
          image: 'Image',
          table: 'Table',
          mermaid: 'Mermaid Diagram',
          katex: 'KaTeX Formula',
          revoke: 'Undo',
          next: 'Redo',
          save: 'Save',
          prettier: 'Prettify',
          pageFullscreen: 'Browser Fullscreen',
          fullscreen: 'Fullscreen',
          preview: 'Preview',
          htmlPreview: 'HTML Preview',
          catalog: 'Catalog',
          github: 'Source Code',
        },
        titleItem: {
          h1: 'Heading 1',
          h2: 'Heading 2',
          h3: 'Heading 3',
          h4: 'Heading 4',
          h5: 'Heading 5',
          h6: 'Heading 6',
        },
        imgTitleItem: {
          link: 'Add Link',
          upload: 'Upload Image',
          clip2upload: 'Crop & Upload',
        },
        linkModalTips: {
          linkTitle: 'Add Link',
          imageTitle: 'Add Image',
          descLabel: 'Description:',
          descLabelPlaceHolder: 'Enter description...',
          urlLabel: 'URL:',
          urlLabelPlaceHolder: 'Enter URL...',
          buttonOK: 'OK',
        },
        clipModalTips: {
          title: 'Crop & Upload Image',
          buttonUpload: 'Upload',
        },
        copyCode: {
          text: 'Copy Code',
          successTips: 'Copied!',
          failTips: 'Copy Failed!',
        },
        mermaid: {
          flow: 'Flowchart',
          sequence: 'Sequence Diagram',
          gantt: 'Gantt Chart',
          class: 'Class Diagram',
          state: 'State Diagram',
          pie: 'Pie Chart',
          relationship: 'ER Diagram',
          journey: 'User Journey',
        },
        katex: {
          inline: 'Inline Formula',
          block: 'Block Formula',
        },
        footer: {
          markdownTotal: 'Words',
          scrollAuto: 'Sync Scroll',
        },
      },
    },
  },
}  as ConfigOption);

const docData = ref({
  title: '新建文档',
  subtitle: '',
})

const state = reactive({
  text: '',
  previewTheme: 'github'
});

const showCancelConfirmDialog = ref<boolean>(false)

const commitDocClick = () => {
  console.log('commit doc')
}

onMounted(() => {
  docData.value.title = '未命名文档'
})
</script>

<template>
  <div class="root">
    <v-card
        variant="outlined"
        :border="0"
        subtitle="编辑下面的表单来编写文档，推荐将标题设置为您文档的一级标题。"
        :title="docData.title"
        class=""
    >
      <v-card-item>
        <div class="mt-2">
          <v-text-field
              density="compact"
              variant="outlined"
              label="文章标题"
              v-model="docData.title"
          ></v-text-field>

          <v-text-field
              density="compact"
              variant="outlined"
              label="文章副标题"
              v-model="docData.subtitle"
          ></v-text-field>

          <MdEditor
              v-model="state.text"
              :language="themeStore.lang"
              :theme="themeStore.isDarkModeEnabled?'dark':''"
              :preview-theme="state.previewTheme"
          />
        </div>

      </v-card-item>

      <v-card-actions class="ml-2 mr-2 mt-1">
        <v-btn
            color="primary"
            variant="flat"
            @click="commitDocClick"
        >
          <template v-slot:prepend><v-icon>mdi-content-save</v-icon></template>
          提交</v-btn>

        <v-btn
            variant="tonal"
            @click="showCancelConfirmDialog=true"
        >
          <template v-slot:prepend><v-icon>mdi-close-box-multiple</v-icon></template>

          取消</v-btn>
      </v-card-actions>



    </v-card>

    <v-dialog
        max-width="500"
        v-model="showCancelConfirmDialog"
    >

      <template v-slot:default>
        <v-card rounded="lg" title="确认取消吗">
          <v-card-text>
            一旦您取消，您编辑的所有内容都将不会被保存。
          </v-card-text>

          <v-card-actions class="mb-1">
            <v-spacer></v-spacer>
            <v-btn
                variant="plain"
                text="我再想想"
                @click="showCancelConfirmDialog=false;"
            ></v-btn>
            <v-btn
                text="确认"
                color="error"
                @click="showCancelConfirmDialog=false; router.back()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

  </div>
</template>

<style scoped lang="less">
.root {
}

.md-editor {
  --md-border-color: #7c7c7c !important;
  border-radius: 4px;
  border: #919191 solid 1px;
  --md-border-active-color: #000 !important;
  height: calc(100vh - 400px);
  --md-bk-color: rgba(0,0,0,0.0) !important;
}

.md-editor-dark {
  --md-bk-color: rgba(0,0,0,0.0) !important;
  --md-border-color: #989898 !important;
}

</style>