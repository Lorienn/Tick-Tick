var vm = new Vue({
    el: "#app",
    data() {
        return {
            storage: window.localStorage,
            todolist: [],
            txt: "",
            newValue: "",
            isShow: true,
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
            }, 1000);
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
                this.storage["display"] = JSON.stringify({
                    isShow: true
                });
                this.todolist = oldList;
            } else {
                //非首次访问页面
                var arr = JSON.parse(this.storage["todo"]);
                this.todolist = arr;
                this.isShow = JSON.parse(this.storage["display"]);
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
        },
        //显示/隐藏已完成事项
        toggle() {
            this.isShow = !this.isShow;
            var display = {
                isShow: this.isShow
            };
            this.storage["display"] = JSON.stringify(display);
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
    },
    computed: {
        isNull() {
            if (this.todolist.length == 0 || this.todolist.every(item => item.isFinish == true)) {
                return true;
            } else {
                return false;
            }
        }
    }
})