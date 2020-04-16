var vm = new Vue({
    el: "#app",
    data() {
        return {
            storage: window.localStorage,
            todolist: [],
            txt: "",
            newValue: "",
            isCheck: [],
            isHide: false,
            tip: "Hide Completed",
            newTime: "",
            spinShow: true
        }
    },
    created() {
        new Promise((resolve, reject) => {
            //设置遮罩层
            setTimeout(() => {
                this.spinShow = false;
            }, 1500);
            resolve();
        }).then((res) => {
            //检查浏览器是否支持localStorage
            if (!window.localStorage) {
                alert("浏览器不支持localStorage!")
            } else if (localStorage.length == 0) {
                //首次访问页面
                const oldList = [{
                        item: "Morning Run",
                        isEdit: false,
                        isFinish: false,
                        time: new Date("October 13, 1975 7:00:00")
                    },
                    {
                        item: "Meeting",
                        isEdit: false,
                        isFinish: false,
                        time: new Date("October 13, 1975 10:00:00")
                    },
                    {
                        item: "Blogging",
                        isEdit: false,
                        isFinish: false,
                        time: new Date("October 13, 1975 21:00:00")
                    }
                ];

                this.storage["todo"] = JSON.stringify(oldList);
                this.todolist = oldList;
            } else {
                //非首次访问页面
                var arr = JSON.parse(this.storage["todo"]);
                for (let i = 0; i < arr.length; i++) {
                    this.todolist.push(arr[i]);
                    if(arr[i].isFinish == true){
                        this.isCheck.push(arr[i]);
                    }
                }
                this.toggle();
            }
        })
    },
    methods: {
        //提示函数
        info(nodesc, content) {
            this.$Notice.info({
                title: `${content}不能为空!`,
                duration: 2
            });
        },
        //增
        addItem() {
            if (!this.txt) {
                this.info(true, '内容');
            } else if (!this.newTime) {
                this.info(true, '时间');
            } else {
                var newItem = {
                    item: this.txt,
                    isEdit: false,
                    isFinish: false,
                    time: this.newTime
                };
                this.todolist.push(newItem);

                //写入LS
                var arr = JSON.parse(this.storage["todo"]);
                arr.push(newItem);
                this.storage["todo"] = JSON.stringify(arr);

                this.txt = "";
            }
        },
        //改
        updateItem(item) {
            var i = this.todolist.indexOf(item);

            //写入LS
            var arr = JSON.parse(this.storage["todo"]);
            arr[i].item = this.newValue;
            this.storage["todo"] = JSON.stringify(arr);

            this.todolist[i].item = this.newValue;
            this.newValue = "";
            this.todolist[i].isEdit = false;
        },
        //删
        removeItem(item) {
            var index = this.todolist.indexOf(item);
            this.todolist.splice(index, 1)

            //写入LS
            var arr = JSON.parse(this.storage["todo"]);
            arr.splice(index, 1);
            this.storage["todo"] = JSON.stringify(arr);
        },
        //点击复选框加入已完成事项
        toggleFinish(item) {
            item.isFinish = !item.isFinish;
            //写入LS
            var arr = JSON.parse(this.storage["todo"]);
            arr[this.todolist.indexOf(item)].isFinish = item.isFinish;
            this.storage["todo"] = JSON.stringify(arr);

            var i = this.isCheck.indexOf(item);
            if (i == -1) {
                this.isCheck.push(item);            
            } else {
                this.isCheck.splice(i, 1);
            }
        },
        //显示/隐藏已完成事项
        toggle() {
            if (!this.isHide) {
                for (x of this.isCheck) {
                    var start = this.todolist.indexOf(x);
                    this.todolist.splice(start, 1);
                }
                this.isHide = !this.isHide;
                this.tip = "Show Completed";
            } else {
                this.todolist = this.todolist.concat(this.isCheck);
                this.isHide = !this.isHide;
                this.tip = "Hide Completed";
            }
        },
        //格式化日期字符串
        doubleNum(n) {
            if (n < 10) {
                return "0" + n;
            } else {
                return n;
            }
        },
        showTime(item) {
            var
                d = new Date(item.time),
                hour = this.doubleNum(d.getHours()),
                min = this.doubleNum(d.getMinutes());
            return `${hour}:${min}`;
        }
    }
})