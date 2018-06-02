Vue.component("temp_ticket", {
    template: document.getElementById("v_temp_tickets"),
    data: function(){
        return {
            code: "loading...",
            points: "loading...",
            showing: true,
            overlay: false,
            refferal: "",
            camp: ""
        };
    },
    methods:{
        toggleShow: function(){
            if(this.showing){ this.showing=false; }
            else{ this.showing=true; }
        },
        refer: function(){
            this.overlay = false;
            api.send("/temp/referral?code="+this.refferal+"&camp="+this.camp,
                obj => {
                    alert("referral code submitted");
                    window.location.reload();
                },
                err => {
                    alert("unable to submit referral code");
                }
            );
        }
    },
    created: function(){
        api.send("/temp/info", obj => {
            this.code = obj.code;
            this.points = obj.points;
        }); 

        api.send("/temp/newUser", obj => {
            if(obj.newUser){
                this.overlay = true;
            }
        });
    }
});
