$(function(){
  
  
  var $list = $('.todo-list');
  var $clonelist = $('#clone-list');
  var $input = $('.todo-input');
  var completeNum=0;
  

  //add from storage

  function initList(){
    bg = chrome.extension.getBackgroundPage(); 
    var tasks = bg.taskinator.get_all();
    var to_add = []
    for (var _id in tasks) {
      if (_id != "counter"){
        //create item
        var complete = "";
        if (tasks[_id].completed_at != null){
          complete = "complete";
        }
        var $li = $('<li id="'+ _id +'" class="li-item ui-state-default '+ complete +'" >');
        var $dragable = $('<span  class="dragable"></span>');
        var $checkbox = $('<span  class="checkbox"></span>');
        var $text = $('<span  class="text taskaya">').text(tasks[_id].name);
        var $remove = $('<span class="remove"></span>');
        var $delete = $('<span class="delete"></span>');

        $li.append($dragable).append($checkbox).append($text).append($remove).append($delete);
        //$li.append($text);
        to_add[tasks[_id].priority] = $li;
        //add it to the list

        //ready for DnD
        //$li.ready(initListItem($li,$checkbox,$remove));
        }
      }

    for (var num in to_add) {
        $list.append(to_add[num])
      }

  }
  //Methods for Adding
  function addTodo(text){
    //add to storage and get id
    _id = bg.taskinator.add_task(text);
    //create item
    var $li = $('<li  id="'+ _id +'"class="li-item ui-state-default">');
    var $dragable = $('<span class="dragable"></span>');
    var $checkbox = $('<span  class="checkbox"></span>');
    var $text = $('<span  class="text taskaya">').text(text);
    var $remove = $('<span class="remove"></span>');
    var $delete = $('<span class="delete"></span>');

    $li.append($dragable).append($checkbox).append($text).append($remove).append($delete);
    //$li.append($text);
    
    //add it to the list
    $list.append($li);

    //ready for DnD
    $li.ready(initListItem($li,$checkbox,$remove, $text, $delete));
  }
  

  //Methods for send
  $('.todo-form').bind('submit', function(e){
    //stop the default behavior
    e.preventDefault();
    
    //get the text
    var text = $input.val();
    if(text){
    
      //add
      addTodo(text);
    
      //delete the value
      $input.val('');
    }else{
       $('.container').animate({ left: "-5px" }, 100).animate({ left: "20px" }, 100)
                            .animate({ left: "-10px" }, 100).animate({ left: "10px" }, 100)
                            .animate({ left: "0px" }, 100);
    }
  });
  
  //Sortable DnD
  $('.todo-list').sortable({
    axis:'y',
    handle: ".dragable",
    revert: 100,
    scroll: false,
    placeholder:"sortable-placeholder",
    cursor:'move',
    start:function(event,ui){
      ui.helper.addClass("exclude-me");
      $(".todo-list .li-item:not(.exclude-me)").css("visibility", "hidden");
      ui.helper.data("clone").hide();
      $(".clone-list .li-item").css("visibility", "visible");
    },
    update: function (event, ui) {
      var data = $(this).sortable('toArray');
      bg.taskinator.reorder(data);
    },
    stop:function(event,ui){
       $(".todo-list .li-item.exclude-me").each(function() {
        var item = $(this);
        var clone = item.data("clone");
        var position = item.position();

        clone.css("left", position.left);
        clone.css("top", position.top);
        clone.show();

        item.removeClass("exclude-me");
      });

      
      $(".todo-list .li-item").css("visibility", "visible");
      $(".clone-list .li-item").css("visibility", "hidden");
    },
  change: function(e, ui) {
    $(".todo-list .li-item:not(.exclude-me)").each(function() {
      var item = $(this);
      var clone = item.data("clone");
      clone.stop(true, false);
      var position = item.position();
      clone.css({
        left: position.left,
        top: position.top
      });
    });
    }
  });
  
  //Button Interactions
  $('.my-func').hover(function(){
    $(this).addClass('hover');
  },function(){
    $(this).removeClass('hover');
  });
  
  $('h1').click(function(){
    var num = $('.todo-list .li-item').length;
    var numComp = $('.todo-list .complete').length;
    //alert(numComp);
    if(num==numComp){
      if(num){
        
        $('.li-item').each(function(){
          $(this).removeClass('complete');
        });
        $('footer').removeClass('active').prop("disabled", true);
        completeNum = 0;
      }
    }else{
      if(num){
        $('.li-item').each(function(){

              $(this).addClass('complete');
              completeNum++;
        });
        $('footer').addClass('active').prop("disabled", false);
      }
    }
     
     
  });
  $('h1').on('mousedown',function(){
    $(this).addClass('click');
  });
  $('h1').on('mouseup',function(){
    $(this).removeClass('click');
  });
  
  $('#delete').click(function(){
    $('.complete').each(function(){
      bg.taskinator.remove_task($(this).attr('id'));
      $(this).remove(); 
    });
    
    completeNum=0;
    $('footer').removeClass('active').prop("disabled", true);
    $('.my-list').height("92%");
    
    $(".todo-list .li-item").each(function() {
        var item = $(this);
        var clone = item.data("clone");
        var position = item.position();

        clone.css("left", position.left);
        clone.css("top", position.top);
     });
    setTimeout(function(){
    $('#my-list').perfectScrollbar('update');},300);
  });
  $('.todo-input').focus(function(){
    $('.icn-input').fadeOut('fast');
    $('.todo-add').removeClass('not-focused');//.prop("disabled", false);
  }).blur(function(){
    $('.icn-input').fadeIn('fast');
    var tmpText = $('.todo-input').val();
    if(!tmpText && !$('.todo-add').hasClass('not-focused')){
    $('.todo-add').addClass('not-focused');//.prop("disabled", true);
    }
  });
  
  $('.todo-add').hover(function(){
    $(this).addClass('hover');
  },function(){
     $(this).removeClass('hover');                  
  });
  
  $('.todo-add').click(function(){
    $(this).addClass('click');
    if(!$('.todo-input').focus()){
    $(this).addClass('not-focused');//.prop("disabled", true);
    }
    setTimeout(function(){
      $('.todo-add').addClass('clickdone');
       
    },400);
    setTimeout(function(){
      $('.todo-add').removeClass('click');
      $('.todo-add').removeClass('clickdone');
      
    },800);
  });
  
  //Functioncs
  function initListItem(li, checkbox, remove, taskaya, delete_task){
      var item = li;
      var itemClone= item.clone();
      item.data('clone',itemClone);
      var position = item.position();
      //alert(position.top);
      itemClone.css({
        left:position.left,
        top:position.top,
        visibility:'hidden'
      }).addClass('clone');
      $('#clone-list').append(itemClone);
      //Complete
      //iniate list
      if(li.hasClass('complete')){
          li.addClass('complete');
          itemClone.addClass('complete');
          completeNum++;
          if(completeNum){
            $('footer').addClass('active').prop("disabled", false);
            $('.my-list').height("85%");
          }
      }

      taskaya.bind('dblclick', function() {
          $(this).attr('contentEditable', true);
      }).blur(
          function() {
              new_text = $(this).text();
              if (!new_text.trim()){
                remove.click();
              }else{
                bg.taskinator.edit_task(item.attr('id'),new_text)
                $(this).attr('contentEditable', false);
            }
      });

      checkbox.click(function(){
        if(li.hasClass('complete')){
          bg.taskinator.incomplete_task(item.attr('id'));

          li.removeClass('complete');
          itemClone.removeClass('complete');
          completeNum--;
          if(!completeNum){
            $('footer').removeClass('active').prop("disabled", true);
            $('.my-list').height("92%");
          }
        }else{
          bg.taskinator.complete_task(item.attr('id'));
          li.addClass('complete');
          itemClone.addClass('complete');
          completeNum++;
          if(completeNum){
            $('footer').addClass('active').prop("disabled", false);
            $('.my-list').height("85%");
          }
        }
      });
    
      //remove
      remove.click(function(){
        if(li.hasClass('complete')){
          completeNum--;
          if(!completeNum){
            $('footer').removeClass('active').prop("disabled", true);
            $('.my-list').height("92%");
          }
        }

        bg.taskinator.remove_task(li.attr('id'));

        li.remove();
        itemClone.remove();

        
        
        
        $(".todo-list .li-item").each(function() {
        var item = $(this);
        var clone = item.data("clone");
        var position = item.position();

        clone.css("left", position.left);
        clone.css("top", position.top);
        });
        $('#my-list').perfectScrollbar('update');
      });
      
      delete_task.click(function(){
        remove.click();
      });
      $('#my-list').perfectScrollbar('update');
      $(".todo-list").sortable('refresh');
  }
  
  //init
  initList();
  $('#my-list').perfectScrollbar();  
  $('.li-item').each(function(){
      var checkbox = $(this).children('.checkbox');
      var remove =$(this).children('.remove');
      var taskaya =$(this).children('.taskaya');
      var delete_task =$(this).children('.delete');

      initListItem($(this), checkbox, remove, taskaya, delete_task);
    });


});