<template>
    <div class="songSearch">
        <div class="ss-left-content">
            <form @submit.prevent="searchFunc(1)">
            <input type="text" v-model="searchText" class="ss-input">
            <button type="submit" class="songSearch">搜索</button>
            </form>
            <table class="ss-table">
                <thead>
                    <th>ID</th>
                    <th>名称</th>
                    <th>歌手</th>
                </thead>
                <tbody v-if="searchResult.length == 0">
                    <td>无</td>
                    <td>无</td>
                    <td>无</td>
                </tbody>
                <tbody v-else>
                    <tr v-for="(item,index) of searchResult" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td><RouterLink :to="{
                            name:'songSearch_detail',
                            query:{
                                id:item.id,
                                name:item.name,
                                artists:item.artists,
                                status:item.status
                            }
                        }">{{ item.name }}</RouterLink></td>
                        <td>{{ item.artists }}</td>
                    </tr>
                </tbody>
            </table>
            <p>
                <button @click="changePage(-1)" :disabled="!canChangePage">←</button>
                当前位于第{{ page }}页
                <button @click="changePage(+1)" :disabled="!canChangePage">→</button>
            </p>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import axios from 'axios'
axios.defaults.withCredentials = true

let searchText = ref('')
let searchResult = ref([])
let page = ref(1)
let canChangePage = ref(true)

async function searchFunc(p){
    page.value = p
    try{
        canChangePage.value = false
        let result = await axios.get('https://163api.qxiao.eu.org/search?limit=10&realIP=116.25.146.177&keywords='+searchText.value+'&offset='+(page.value-1)*10)
        searchResult.value = []
        if(result.data.code == 200){
            if(result.data.result.songs != undefined){
                for(let item of result.data.result.songs){
                    let artists = ''
                    for(let artist of item.artists){
                        artists += artist.name + ' '
                    }
                    let status = (item.fee == 0 | item.fee == 8) ? 'ok' : 'vip'
                    searchResult.value.push({
                        id:item.id,
                        name:item.name,
                        artists,
                        status
                    })
                }
            }
        }
        canChangePage.value = true
    }catch(error){
        canChangePage.value = true
        alert(error)
    }
}

function changePage(n){
    if(n == 1){
        if(searchResult.value.length == 10) page.value++
        else return
    }else{
        if(page.value != 1) page.value--
        else return
    }
    searchFunc(page.value)
}
</script>

<style scoped>
* {
    margin: 5px;
}
div.songSearch{
    display: flex;
    text-align: center;
}

button.songSearch{
    border: none;
    background-color: #4CAF50;
    font-size: 25px;
    color: white;
    border-radius: 10px;
}

.ss-input{
    font-size: 20px;
}

.ss-table{
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    border: 1px solid black;
}

.ss-left-content {
    width: 40%;
}

.ss-right-content {
    width: 60%;
}

</style>