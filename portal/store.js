function canLocalStorage(){
    try{
        window.localStorage.setItem("","");
        return true;
    }catch(e){
        return false;
    }
}

const store_user = {
    state:{
        user: undefined,
        name: undefined,
        _tkn: undefined,
        dpic: undefined,
        verified: false
    },
    mutations:{
        setUser: function(state, obj){
            state.user = obj.user_id;
            state.name = obj.name;
            state.dpic = obj.picture_large;
            state._tkn = obj._tkn;

            gtag("set", {"user_id": obj.user_id});
        },
        setVerified: function(state, vstate){
            state.verified = vstate;
        }
    },
    actions:{
        updateUser: function(store, obj){
            if(canLocalStorage()){
                var ls = window.localStorage;

                if(obj.user_id){
                    ls.setItem("user_id", obj.user_id);
                    ls.setItem("name", obj.name);
                    ls.setItem("picture_large", obj.picture_large);
                    ls.setItem("_tkn", obj._tkn);
                }else{
                    ls.removeItem("user_id");
                    ls.removeItem("name");
                    ls.removeItem("picture_large");
                    ls.removeItem("_tkn");
                }
            }

            store.commit("setUser", obj);
        },
        clearUser: function(store){
            var empty = {
                user_id: "",
                name: "",
                picture_large: "",
                _tkn: ""
            };

            store.dispatch("updateUser", empty);
        },
        getUser: function(store, ele){
            api.getUser(function(data){
                store.commit("setVerified", data.verified);
                if(!data.verified){ ele.sms = 1; }
            });
        }
    },
    getters:{
        loggedIn: function(state){
            return (state._tkn && state.user) ?true :false;
        }
    }
};

const store = new Vuex.Store({
    modules: {
        user: store_user
    },
    state:{
        featured: [],
        preview: [],
        list: [],
        pages: {},
        saves: {},
        loading: false
    },
    getters:{
        page: function(state){
            return function(id){ return state.pages[id]; }
        },
        saved: function(state){
            return function(id){ return state.saves[id] ?true :false; }
        }
    },
    mutations:{
        setPreview: function(state, ids){
            state.preview = ids;
        },
        setPage: function(state, page){
            Vue.set(state.pages, page.id, page);
        },
        setPages: function(state, pages){
            for(i in pages){
                var page = pages[i];
                Vue.set(state.pages, page.id, page);
            }
        },
        setSaves: function(state, saves){
            state.saves = {};
            for(i in saves){
                Vue.set(state.saves, saves[i], true);
            };
        },
        setSave: function(state, info){
            // info - [pageid, saveState]
            Vue.set(state.saves, info[0], info[1] ?true :false);
        },
        setList: function(state, list){
            state.list = list;
        },
        setFeatured: function(state, list){
            state.featured = list;
        },
        setLoading: function(state, loading){
            state.loading = loading;
        }
    },
    actions:{
        getPreview: function(store){
            api.getPreview(function(data){
                store.commit("setPages", data.pages);
                store.commit("setPreview", data.latest);
            });
        },
        getPage: function(store, id){
            api.getPage(id, function(data){
                store.commit("setPage", data);
            });
        },
        getList: function(store){
            store.dispatch("getSaves");

            api.getList(function(data){
                if(data.ok){
                    store.commit("setList", data.latest);
                    store.commit("setPages", data.pages);
                    store.commit("setFeatured", data.featured);
                }else if(data.code=="403 Forbidden"){
                    // redirect to user for sms verification
                    router.push("/user");
                }
            });
        },
        getSaves: function(store){
            api.getSaves(function(data){
                var ids = [];

                for(i in data.pages){
                   ids.push(data.pages[i].id);
                }
                store.commit("setPages", data.pages);
                store.commit("setSaves", ids);
            });
        },
        unsavePage: function(store, pageid){
            // lazy loading... local first
            store.commit("setSave", [pageid, false]);
            api.setUnsave(pageid);
        },
        savePage: function(store, pageid){
            store.commit("setSave", [pageid, true]);
            api.setSave(pageid);
        }
    }
});

(function(){
    if(window.localStorage && window.localStorage._tkn){
        store.dispatch("updateUser", window.localStorage);
    }
})();
