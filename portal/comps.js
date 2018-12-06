function getHTML(id){
    return "<div id='"+id+"'>"+document.getElementById(id).innerHTML+"</div>";
}

Vue.component("v_display_card", {
    props: ["id"],
    template: getHTML("v_display_card"),
    computed:{
        page: function(){
            var p = this.$store.getters.page(this.id);
            return !p ?{} :p;
        },
        saved: function(){ return this.loggedIn && this.$store.getters.saved(this.id); },
        loggedIn: function(){ return this.$store.getters.loggedIn; }
    },
    methods:{
        save: function(evt){
            this.$store.dispatch("savePage", this.id);
            evt.stopPropagation();
        },
        unsave: function(evt){
            this.$store.dispatch("unsavePage", this.id);
            evt.stopPropagation();
        },
        visitPage: function(){
            if(this.loggedIn){ router.push("/page/"+this.id); }
        }
    },
    created: function(){ this.$store.dispatch("getPage", this.id); }
});

Vue.component("v_loader", {
    template: getHTML("v_loader")
});

const v_User_Saves = {
    props: ["list"],
    template: getHTML("v_user_saves")
};

const v_User = {
    template: getHTML("v_user"),
    components: { "v_user_saves": v_User_Saves },
    computed: Object.assign({},
        Vuex.mapState(["user"]),{
        "saves": function(){
            var res = [];
            for(i in this.$store.state.saves){
                if(this.$store.state.saves[i]){
                    res.push(i);
                }
            }

            return res;
        }
    }),
    created: function(){
        this.$store.commit("setLoading", true);
        this.$store.dispatch("getUser", this);
        this.$store.dispatch("getSaves");
    },
    data: function(){
        return {
            "sms": 0,
            "loading": false,
            "sms_phone": "",
            "sms_code": "",
        };
    },
    methods:{
        sendSmsPhone: function(){
            var msg = "Please insert a valid number";

            if(parseInt(this.sms_phone)<80000000){
                alert(msg);
            }else{
                var comp = this;
                this.loading = true;

                api.smsPhone(this.sms_phone, function(data){
                    if(!data.ok){
                        alert(data.error);
                    }else{
                        comp.sms = 2;
                    }

                    comp.loading = false;
                });
            }
        },
        sendSmsCode: function(){
            var msg = "6 digit code required";

            if(parseInt(this.sms_code)>1000000){
                alert(data.error);
            }else{
                var comp = this;
                this.loading = true;

                api.smsCode(this.sms_code, function(data){
                    if(!data.ok){
                        alert(msg);
                    }else{
                        alert("all done :)");
                        comp.$router.push("/");
                        comp.sms = 0;
                    }

                    comp.loading = false;
                });
            }
        }
    }
};

const v_Page = {
    template: getHTML("v_page"),
    data: function(){
        return { "content": 0 };
    },
    computed:{
        id: function(){ return this.$route.params.id; },
        page: function(){ return this.$store.getters.page(this.id); }
    },
    methods:{
        visitPage: function(){
            if(this.page.link){
                this.$router.push("/website/"+this.id);
            }
        },
        loadReviews: function(){
            loadDisqus(this.id);
            this.content = 1;
        }
    },
    created: function(){
        this.$store.dispatch("getPage", this.id);
    }
};

const v_Featured = {
    template: getHTML("v_featured"),
    computed:{
        pages: function(){
            var res = [];
            var list = this.$store.state.featured;
            for(i in list){
                res.push(this.$store.getters.page(list[i]).featured);
            }

            return res;
        }
    },
    data:function(){
        return { "id":0 };
    },
    methods:{
        visitPage:function(){
            var id = this.$store.state.featured[this.id];
            router.push("/featured/"+id);
        }
    }
};

const v_List = {
    template: getHTML("v_list"),
    computed: Vuex.mapState(["list"]),
    created: function(){ this.$store.dispatch("getList"); },
    components:{
        "v_featured": v_Featured
    }
};

const v_Contact = {
    template: getHTML("v_contact"),
    methods:{
        submitForm: function(){
            document.forms["contact"].submit();
        }
    }
};

const v_Contribute = {
    template: getHTML("v_contribute"),
    methods:{
        submitForm: function(){
            document.forms["contribute"].submit();
        }
    }
};

const v_About = {
    template: getHTML("v_aboutus")
};

const v_Wrapper = {
    template: getHTML("v_wrapper"),
    created: function(){
        if(!this.$store.state.user._tkn){
            this.$router.push("/landing");
        }
    },
    data:function(){
        return { menu:0 };
    }
};
