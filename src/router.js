import UploadFile from "@/components/UploadFile";
import WelcomePage from "@/components/WelcomePage";
import ManualIntervention from "@/components/ManualIntervention";
import {createRouter, createWebHashHistory} from "vue-router"
import VersionManage from "@/components/VersionManage";

const routes = [
    {
      path: "/",
      component: WelcomePage,
    },
    {
        path: '/upload-files',
        component: UploadFile,
    },
    {
        path: '/manual-intervention',
        component: ManualIntervention,
    },
    {
        path: '/version-manage',
        component: VersionManage,
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})