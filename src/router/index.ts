import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import Search from '@/pages/Search.vue'
import Playlist from '@/pages/Playlist.vue'
import Detail from '@/pages/Detail.vue'

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            name:'home',
            path:'/home',
            component:Home
        },
        {
            name:'search',
            path:'/search',
            component:Search,
            children:[
                {
                    name:'song_detail',
                    path:'detail/:id/:name/:artists',
                    component:Detail
                },
            ]
        },
        {
            name:'playlist',
            path:'/playlist',
            component:Playlist
        },
    ]
})

export default router