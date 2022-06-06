import UploadFile from "@/components/UploadFile";
import WelcomePage from "@/components/WelcomePage";
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {
      path: "/",
      component: WelcomePage,
    },
    {
        path: '/upload-files',
        component: UploadFile,
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})