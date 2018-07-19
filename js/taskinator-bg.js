/*Ghuduw's Taskinator
 **Task
    created_at: creat_date,
    name: task_name,
    due_date: due_dt,
    completed_at: null, 
    priority: p

*/
class Taskinator {



    constructor(){
        var tasks = storage_get("tasks") || {};
        tasks["counter"] = tasks["counter"]  ||  0;
        storage_set("tasks", tasks);
        if (storage_get("taskinator_btn") ===  undefined) {
            storage_set("taskinator_btn", false);
        }
    }

    add_task(task_name){
        var data = {name: task_name, created_at: new Date(), due_date: null, completed_at: null}
        var tasks = storage_get("tasks") || {};
        var _id = Math.random().toString(36).substring(7);
        tasks["counter"] = tasks["counter"] + 1;
        data.priority = tasks["counter"];
        tasks[_id] = data;
        storage_set("tasks", tasks);
        return _id;
    }

    remove_task(_id){
        var tasks = storage_get("tasks") || {};
        if (typeof tasks[_id] !== 'undefined') {
            delete tasks[_id];
            tasks["counter"] = tasks["counter"] - 1;
            storage_set("tasks", tasks);2
        }

    }

    edit_task(_id,new_text){
        var tasks = storage_get("tasks") || {};
        if (typeof tasks[_id] !== 'undefined') {
            tasks[_id].name = new_text;
            storage_set("tasks", tasks);2
        }

    }

    reorder(data){
        var tasks = storage_get("tasks") || {};
        for (var p in data) {
           tasks[data[p]].priority = p;
        }
        storage_set("tasks", tasks);
    }

    complete_task(_id){
        var tasks = storage_get("tasks") || {};
        if (typeof tasks[_id] !== 'undefined') {
            tasks[_id].completed_at = new Date();
            storage_set("tasks", tasks);
        }

    }

    incomplete_task(_id){
        var tasks = storage_get("tasks") || {};
        if (typeof tasks[_id] !== 'undefined') {
            tasks[_id].completed_at = null;
            storage_set("tasks", tasks);
        }

    }

    empty(){
        var tasks = {};
        tasks["counter"] = 0;
        storage_set("tasks", tasks);

    }

    get_all(){
        return storage_get("tasks") || {};
    }

    get_taskinator_btn_state(){
        return storage_get("taskinator_btn");
    }

    switch_taskinator_btn_state(){
        taskinator_btn = this.get_taskinator_btn_state();
        if (taskinator_btns == true){
            storage_get("taskinator_btn",false);
        }else{
            storage_get("taskinator_btn",true);
        }
    }

};