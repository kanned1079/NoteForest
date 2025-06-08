<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  pageTransition: {
    name: 'layout-fade'
  }
})
import useThemeStore from "~/store/themeStore";



import {type ConfigOption, MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {config as mdEditorConfig} from "md-editor-v3"
import userStore from "~/store/userStore";
import {useI18n} from "vue-i18n";
import {commitNewDocument, getDocumentByUuid, updateDocumentByUuid} from "~/api/document";
import type {DocumentItem} from "~/types/doc";
import {useRoute} from "vue-router";

const {t, locale} = useI18n()
const route = useRoute()
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
} );

const docData = ref<DocumentItem>({
  id: '',
  title: '',
  subtitle: '',
  category: '',
  content: '',
  image_url: '',
})

const showMeta = ref<boolean>(false)

const state = reactive({
  previewTheme: 'github'
});

const showCancelConfirmDialog = ref<boolean>(false)

const editType = ref<'create' | 'edit'>('create')

const commitDocClick = async () => {
  if (!docData.value.title) {
    themeStore.showMessage(t('docEdit.titleRequired'), 'error')
    return
  }

  console.log('commit doc')

  if (editType.value === 'create') {
    const { code, err } = await commitNewDocument(docData.value)

    if (code === 200) {
      themeStore.showMessage(t('docEdit.saveSuccess'), 'success')
      setTimeout(() => router.back(), 500)
    } else if (code === 409) {
      themeStore.showMessage(t('docEdit.docExist'), 'warning')
    } else {
      themeStore.showMessage(`${t('docEdit.saveError')}${err}`, 'error')
    }

  } else if (editType.value === 'edit') {
    const { code, err } = await updateDocumentByUuid(docData.value.id, docData.value)
    console.log('修改code', code)

    if (code === 200) {
      themeStore.showMessage(t('docEdit.saveSuccess'), 'success')
      setTimeout(() => router.back(), 500)
    } else if (code === 400) {
      themeStore.showMessage(t('docEdit.dataIncomplete'), 'warning')
    } else if (code === 404) {
      themeStore.showMessage(t('docEdit.docNotFound'), 'error')
    } else {
      themeStore.showMessage(`${t('docEdit.saveError')}${err}`, 'warning')
    }

  } else {
    themeStore.showMessage(t('docEdit.unknownEditType'), 'error')
  }
}

onBeforeMount( async () => {
  console.log(route.params.id)
  if (route.params.id) {
    if (route.params.id === 'new') {
      // 新建
      editType.value = 'create'
    } else {
      let {code, data} = await getDocumentByUuid(route.params.id as string)
      if (code === 200 && data) {
        docData.value = data
        editType.value = 'edit'
      }
    }
  }
})

onMounted(() => {
  docData.value.title = locale.value==='zh-cn'?'未命名文档':'Untitled document'
})
</script>

<template>
  <div class="root">

    <v-card
        variant="outlined"
        :border="0"
        :subtitle="t('docEdit.metaEditTip')"
        :title="docData.title"
        class=""
    >
      <template v-slot:append>
        <v-btn
          color="primary"
          variant="tonal"
          @click="showMeta=true"
          style="text-transform: none !important;"
        >
          <template v-slot:prepend><v-icon>mdi-book-information-variant</v-icon></template>
          {{ t('docEdit.editMeta') }}
        </v-btn>
      </template>

      <v-card-item>
        <div class="mt-2">
<!--          <v-text-field-->
<!--              density="compact"-->
<!--              variant="outlined"-->
<!--              label="文章标题"-->
<!--              v-model="docData.title"-->
<!--          ></v-text-field>-->

<!--          <v-text-field-->
<!--              density="compact"-->
<!--              variant="outlined"-->
<!--              label="文章副标题"-->
<!--              v-model="docData.subtitle"-->
<!--          ></v-text-field>-->

<!--          <v-text-field-->
<!--              density="compact"-->
<!--              variant="outlined"-->
<!--              label="分类"-->
<!--              v-model="docData.category"-->
<!--          ></v-text-field>-->

          <MdEditor
              v-model="docData.content"
              :language="themeStore.lang"
              :theme="themeStore.isDarkModeEnabled?'dark':undefined"
              :preview-theme="state.previewTheme"
              style="z-index: 100000"
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
          {{ editType === 'create' ? t('docEdit.commit') : t('docEdit.confirmEdit') }}</v-btn>

        <v-btn
            variant="tonal"
            @click="showCancelConfirmDialog=true"
        >
          <template v-slot:prepend><v-icon>mdi-close-box-multiple</v-icon></template>
          {{ t('docEdit.cancel') }}
          </v-btn>
      </v-card-actions>

    </v-card>

    <v-dialog
        max-width="500"
        v-model="showCancelConfirmDialog"
    >

      <template v-slot:default>
        <v-card rounded="lg" :title="t('docEdit.cancelConfirm')" density="comfortable">
          <v-card-text>
            {{ t('docEdit.cancelTip') }}
          </v-card-text>

          <v-card-actions class="mb-1">
            <v-spacer></v-spacer>
            <v-btn
                variant="plain"
                :text="t('docEdit.thinkAgain')"
                @click="showCancelConfirmDialog=false;"
            ></v-btn>
            <v-btn
                :text="t('docEdit.confirm')"
                color="error"
                @click="showCancelConfirmDialog=false; router.back()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <v-dialog
        v-model="showMeta"
        class="v-dialog"
    >
      <v-card
        hover
        variant="flat"
        density="comfortable"
        class="mx-auto"
        :title="t('docEdit.editMeta')"
        :subtitle="t('docEdit.editMetaTip')"
      >

        <template v-slot:prepend>
          <v-icon size="large">mdi-book-information-variant</v-icon>
        </template>

        <template v-slot:append>
          <v-icon
              class="close-meta-icon"
              @click="showMeta = false"
          >
            mdi-window-close</v-icon>
        </template>
        <v-card-item>
          <div class="mt-2">
            <v-text-field
                density="compact"
                variant="outlined"
                :label="t('docEdit.title')"
                v-model="docData.title"
            ></v-text-field>

            <v-text-field
                density="compact"
                variant="outlined"
                :label="t('docEdit.subtitle')"
                v-model="docData.subtitle"
            ></v-text-field>

            <v-text-field
                density="compact"
                variant="outlined"
                :label="t('docEdit.category')"
                v-model="docData.category"
            ></v-text-field>

            <v-text-field
                density="compact"
                variant="outlined"
                :label="t('docEdit.imageUrl')"
                v-model="docData.image_url"
            ></v-text-field>

            <v-card
                variant="flat"
                height="200"
                class="mt-4 mb-4"
                v-if="docData.image_url"

            >
              <v-parallax
                  :src="docData.image_url"
                  scale="1"
              >
              </v-parallax>
            </v-card>

            </div>
        </v-card-item>


      </v-card>

    </v-dialog>

  </div>
</template>

<style scoped lang="less">
.root {
}

.md-editor {
  z-index: 100000 !important;
  --md-border-color: #7c7c7c !important;
  border-radius: 4px;
  border: #919191 solid 1px;
  --md-border-active-color: #000 !important;
  height: calc(100vh - 140px);
  --md-bk-color: rgba(0,0,0,0.0) !important;
}

.md-editor-dark {
  --md-bk-color: rgba(0,0,0,0.0) !important;
  --md-border-color: #989898 !important;
}

.close-meta-icon {
  opacity: .8;
  transition: ease-in-out 300ms;
}

.close-meta-icon:hover {
  transform: rotate(90deg);
  opacity: 0.5;
}


.v-dialog {
  /* 让对话框最大宽度不超过90vw，最小宽度为320px，自动居中 */
  max-width: 90vw !important;
  min-width: 320px !important;
  margin: 0 auto;
}

.v-card.mx-auto {
  width: 100% !important;
  max-width: 440px;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 8px;
}

.close-meta-icon {
  cursor: pointer;
  font-size: 24px;
  color: var(--v-theme-on-surface);
  transition: color 0.3s ease;
}
.close-meta-icon:hover {
  color: var(--v-theme-error);
}

.v-card-item > div {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 图片展示卡片高度自适应，最大高度限制 */
.v-card[variant="flat"][height="200"] {
  height: auto !important;
  max-height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

/* v-parallax 宽度满卡片宽度，高度自动 */
.v-parallax {
  width: 100% !important;
  height: 100% !important;
  border-radius: 8px;
}

/* 小屏幕调整 */
@media (max-width: 480px) {
  .v-card.mx-auto {
    max-width: 95vw;
    padding: 12px;
  }
}

</style>