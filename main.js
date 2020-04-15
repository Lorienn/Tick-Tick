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
            newTime: new Date(),
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
                const oldList = [{},
                    {
                        item: "Morning Run",
                        isEdit: false,
                        time: new Date("October 13, 1975 7:00:00")
                    }
                ];
                for (let i = 0; i < oldList.length; i++) {
                    if (i == 0) {
                        localStorage["id"] = JSON.stringify(oldList[i]);
                    } else {
                        localStorage[oldList[i].item] = JSON.stringify(oldList[i]);
                    }
                }
                this.todolist = [oldList[1]];
            } else if (localStorage.length == 1 && localStorage.id) {
                //非首次访问页面，且内容为空
                this.todolist = [];
            } else {
                //非首次访问页面
                for (let i = 0; i < localStorage.length; i++) {
                    var
                        key = localStorage.key(i),
                        value = JSON.parse(localStorage.getItem(key));

                    if (key == "id") {
                        continue;
                    } else {
                        this.todolist.push(value);
                    }
                }
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
                    time: this.newTime
                };
                this.todolist.push(newItem);

                //写入LS
                this.storage[this.txt] = JSON.stringify(newItem);

                this.txt = "";
            }
        },
        //改
        updateItem(item) {
            var i = this.todolist.indexOf(item);

            //写入LS
            var newItem = JSON.parse(this.storage[item.item]);
            newItem.item = this.newValue;
            this.storage.removeItem(item.item);
            this.storage[this.newValue] = JSON.stringify(newItem);

            this.todolist[i].item = this.newValue;
            this.newValue = "";
            this.todolist[i].isEdit = false;
        },
        //删
        removeItem(item) {
            this.todolist.splice(this.todolist.indexOf(item), 1)

            //写入LS
            this.storage.removeItem(item.item);
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
        //点击复选框加入已完成事项
        addCheck(item) {
            var i = this.isCheck.indexOf(item);
            if (i == -1) {
                this.isCheck.push(item);
            } else {
                this.isCheck.splice(i, 1);
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