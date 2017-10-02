/* Stub JS file for your tinychat app! */

$(document).ready(() => {
  function switchMsgView (msgObj, newView, classToRemove, classToAdd) {
    msgObj
        .html(newView)
        .removeClass(classToRemove)
        .addClass(classToAdd);
  }

  function createEditView (oldMsg) {
    const editView = $('<div></div>');
    $('<input></input>') // view for the input field
        .addClass('form-control')
        .val(oldMsg)
        .appendTo(editView);
    $('<button></button') // view for the cancel button
        .addClass('btn btn-danger cancel')
        .html('Cancel')
        .appendTo(editView);
    $('<button></button>') // view for the save button
        .addClass('btn btn-success save')
        .html('Save')
        .appendTo(editView);
    return editView;
  }


  /*
  * PUT request to update the server of with the new content for
  * the spcific message id
  *
  * function updateMessage (msgId, data, successCb, errorCb) {
  *   $.ajax({
  *     url: `/message/${msgId}`,
  *     type: 'PUT',
  *     data: JSON.stringify(data),
  *     contentType: 'application/JSON'
  *     success: (res) => successCb(res),
  *     error: (jqXHR, textStatus, errorThrown) => {
  *       console.error(jqXHR, textStatus, errorThrown)
  *       errorCb()
  *     }
  *   });
  * }
  */
  function switchToEdit (msgObj) {
    const prevMsgView = msgObj.html();
    const prevMsgContent = msgObj.find('.message').html();
    const editItem = createEditView(prevMsgContent);
    switchMsgView(msgObj, editItem, 'user-message', 'list-group-item-warning');
    editItem.find('.cancel').click(() => {
      switchMsgView(msgObj, prevMsgView, 'list-group-item-warning', 'user-message');
      enableEditFunc(msgObj);
    });
    editItem.find('.save').click(() => {
      const newMsg = editItem.find('input').val();
      // ########
      switchMsgView(msgObj, prevMsgView, 'list-group-item-warning', 'user-message');
      enableEditFunc(msgObj);
      msgObj.find('.message').html(newMsg);
      displayLastEditTag(msgObj, Date.now());
      // ########

      /*
      * Where PUT reqest would be called to update the server. On success the
      * above functions would be run. On fail, we can alert the user that their
      * message could not be updated
      * 
      * updateMessage (msgId, data, (res) => {
      *   // Where the functions between the '#' would be run
      * }, () => {
      *   alert('Your message could not be updated');
      * });
      */
    });
  }

  function displayLastEditTag (msgObj, timestamp) {
    let editBadge;
    if ((msgObj.find('.badge')).length === 1) {
      editBadge = msgObj.find('.badge');
    } else {
      editBadge = $('<div></div>')
        .addClass('badge badge-secondary')
        .prependTo(msgObj);
    }
    editBadge.html(`LastEdited: ${new Date(+timestamp).toUTCString()}`);
    return editBadge;
  }

  function enableEditFunc (msgObj) {
    msgObj.find('.message').click(() => {
      switchToEdit(msgObj);
    });
  }

  function createNewMessage (data) {
    const newListGroupItem = $('<div></div>')
      .addClass('list-group-item')
      .attr('data-msg-id', data.id);
    $('<h5></h5>') // view for the username
      .addClass('mb-1')
      .html(data.author)
      .appendTo(newListGroupItem);
    $('<small></small>') // view for created timestamp
      .html(new Date(data.timestamp).toUTCString())
      .appendTo(newListGroupItem);
    $('<p></p>') // view for message content
      .addClass('mb-1 message')
      .html(data.content)
      .appendTo(newListGroupItem);
    return newListGroupItem;
  }

  function appendToChat (newMsgObj) {
    const listGroup = $('.list-group');
    newMsgObj.appendTo(listGroup);
    listGroup.scrollTop(listGroup[0].scrollHeight);
  }

  function transformData (data) {
    data.messages.forEach((msg) => {
      const newMsgObj = createNewMessage(msg);
      (msg.last_edited && displayLastEditTag(newMsgObj, msg.last_edited));
      appendToChat(newMsgObj);
    });
  }

  /*
  * GET req that mimics the below function. This function would be polling
  * the server asking the server for the most recent messages.
  *
  * function getMessages () {
  *   $.get('/message/all', (res) => {
  *     transformData(res);
  *   }).done(() => {
  *     console.info('success');
  *   }).fail((jqXHR, textStatus, errorThrown) => {
  *     // where errors would be handled
  *   }).always(() => {
  *     setTimeout(getMessage, 1000)
  *   })
  * }
  *
  * getMessages();
  */

  // Stub AJAX call that demos getting the fixture data
  $.getJSON('/fixtures/fakedata.json', (data) => {
    console.log('success', data);
    transformData(data);
  }).done(() => {
    console.log('another success message');
  }).fail(() => {
    console.error('error');
  }).always(() => {
    console.info('complete');
  });

  /*
  * Simple POST req for creating new messages to our server
  *
  * function createMessage (data, successCb, errorCb) {
  *   $.post('/message, data, () => {
  *     successCb();
  *   }).fail((jqXHR, textStatus, errorThrown) => {
  *     console.error(jqXHR, textStatus, errorThrown);
  *     errorCb();
  *   });
  * }
  */
  $('#needs-validation').submit((e) => {
    e.preventDefault();
    const data = {
      id: 15, // this id would normally be set from the server
      author: $('#username').val() || 'anon',
      timestamp: Date.now(),
      content: $('#msg-input').val()
    };
    // #########
    $('#msg-input').val('');
    const newChatMsg = createNewMessage(data);
    newChatMsg.addClass('user-message');
    appendToChat(newChatMsg);
    enableEditFunc(newChatMsg);
    // #########
    /*
    * Where we would call the POST request funciton. On a successful request,
    * the above function would be run, see example above. On a failed
    * request, we can alert the user that their message could not be sent.
    *
    * createMessage(data, () => {
    *   // Where the functions between the '#' would be run
    * }, () => {
    *   alert('Your message could not be sent');
    * });
    */
  });
});
