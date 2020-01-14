$(document).ready(function() {

  var html_template = $('#todo-template').html();
  var template_function = Handlebars.compile(html_template);
  var url_api = 'http://157.230.17.132:3015/todos/';

  stampa_todos();

  //intercetto il click su icona inserisci
  $('.new-todo-button').click(function() {
    //leggo il testo da inserire
    var new_todo_text = $('#new-todo-text').val().trim();
    if (new_todo_text.length > 0) {
      // resetto input
      $('#new-todo-text').val('');
      crea_todo(new_todo_text);
    } else {
      alert('inserisci il testo nel campo');
    }
  });

  // inserisco le CoseDaFare con il tasto invio
  $('#new-todo-text').keypress(function(event) {
    //leggo il testo da inserire
    if (event.which === 13) {
      var new_todo_text = $('#new-todo-text').val().trim();
      if (new_todo_text.length > 0) {
        // resetto input
        $('#new-todo-text').val('');
        crea_todo(new_todo_text);
      } else {
        alert('inserisci il testo nel campo');
      }
    }
  });

  //inserisco o tolgo al click sottolineatura completato
  $("ul").on("click", ".todo-text", function() {
    var fatto = $(this).parent().hasClass("completato");
    var todo_id = $(this).parent().attr('data-todo_id');

    $.ajax({
      'url': url_api + todo_id,
      'method': 'PATCH',
      'data': {
        'done': (fatto == false ? 1 : 0)
      },
      'success': function(data) {
        stampa_todos();
      },
      'error': function() {
        alert('errore');
      }
    });
  });

  //cancellazione todo
  $('#todo-list').on('click', '.delete-todo', function() {
    //recupero id item da cancellare
    var delete_todo_id = $(this).parent().attr('data-todo_id');
    cancella_todo(delete_todo_id);
  });

  $('#todo-list').on('click', '.edit-todo', function() {

    $('.todo-text').removeClass('hidden');
    $('.edit-todo-input').removeClass('active');
    $('.edit-todo').removeClass('hidden');
    $('.save-todo').removeClass('active');

    var todo_li = $(this).parent();

    todo_li.find('.todo-text').addClass('hidden');
    todo_li.find('.edit-todo-input').addClass('active');

    todo_li.find('.edit-todo').addClass('hidden');
    todo_li.find('.save-todo').addClass('active');

  });

  $('#todo-list').on('click', '.save-todo', function() {

    var todo_li = $(this).parent();

    var edit_todo_text = todo_li.find('.edit-todo-input').val().trim();

    if (edit_todo_text.length > 0) {
      var edit_todo_id = todo_li.attr('data-todo_id');
      modifica_todo(edit_todo_id, edit_todo_text);

    } else {
      alert('inserisci il testo');
    }
  });

  function stampa_todos() {
    //resetto elenco lista
    $('#todo-list').empty();

    $.ajax({
      'url': url_api,
      'method': 'GET',
      'success': function(data) {

        var todos = data;
        for (var i = 0; i < todos.length; i++) {
          var todo_corrente = todos[i];
          var testo_todo = todo_corrente.text;
          var id_todo = todo_corrente.id;
          var fatto = todo_corrente.done;

          var template_data = {
            todo_id: id_todo,
            todo_text: testo_todo,
            done: (fatto == 1 ? 'completato' : "")
          };
          var html_todo = template_function(template_data);
          $('#todo-list').append(html_todo);

        }
      },
      'error': function() {
        alert('errore');
      }
    });
  } //fine funzione stampa_todos

  function crea_todo(testo_nuovo_todo) {
    $.ajax({
      'url': url_api,
      'method': 'POST',
      'data': {
        'text': testo_nuovo_todo
      },
      'success': function(data) {
        stampa_todos();
      },
      'error': function() {
        alert('errore');
      }
    });
  } //termine funzione testo_nuovo_todo

  function cancella_todo(todo_id) {
    $.ajax({
      'url': url_api + todo_id,
      'method': 'DELETE',
      'success': function(data) {
        stampa_todos();
      },
      'error': function() {
        alert('errore');
      }
    });
  }

  function modifica_todo(todo_id, testo_todo) {

    $.ajax({
      'url': url_api + todo_id,
      'method': 'PATCH',
      'data': {
        'text': testo_todo
      },
      'success': function(data) {
        stampa_todos();
      },
      'error': function() {
        alert('errore');
      }
    });
  }
}); //termine document.ready
