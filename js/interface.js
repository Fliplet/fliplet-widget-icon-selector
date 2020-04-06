var widgetInstanceId = $('[data-widget-id]').data('widget-id');
var data = Fliplet.Widget.getData() || {};
var fontAwesomeIcons = Fliplet.Registry.get('fontAwesomeIcons');
var allIcons = [];

// Compile templates
var fontAwesomeTemplate = Fliplet.Widget.Templates['templates.interface.font-awesome'];
var searchTemplate = Fliplet.Widget.Templates['templates.interface.search-font'];;

function attachListeners() {
  $('.form-horizontal')
    .on('keyup change', '.search-field', function() {
      var value = $(this).val();

      if (value.length) {
        $(this).parents('.search-holder').addClass('searching');
        value = value.toLowerCase();
        searchIcon(value);
      } else {
        $(this).parents('.search-holder').removeClass('searching');
        renderFullList(fontAwesomeIcons);
      }
    })
    .on('click', '.icon-item', function() {
      $('.icon-item').not(this).removeClass('selected');
      $(this).toggleClass('selected');
      Fliplet.Widget.emit('icon-clicked', {isSelected: !!$('.icon-item.selected').data('icon-id')});
    })
    .on('click', '.clear-search', function() {
      $('.search-field').val('');
      $('.search-field').trigger('blur');
      $('.search-field').parents('.search-holder').removeClass('searching');
      renderFullList(fontAwesomeIcons);
    });
}

function searchIcon(value) {
  var results = _.filter(allIcons, function(icon) {
    var found = false;
    
    if (icon.filter) {
      icon.filter.forEach(function(filter) {
        if (filter.toLowerCase().indexOf(value) > -1) {
          found = true;
        }
      });
    }

    if (icon.id.toLowerCase().indexOf(value) > -1) {
      found = true;
    }
    
    return found;
  });
  
  var finalResult = {
    value: value,
    icons: results
  };

  var $target = $('.font-awesome-icons');
  var compiledTemplate = searchTemplate(finalResult);
  $target.html(compiledTemplate);
}

function renderFullList(iconsData) {
  var $target = $('.font-awesome-icons');
  var compiledTemplate = fontAwesomeTemplate(iconsData);
  $target.html(compiledTemplate);

  if (data && data.icon) {
    $('[data-icon-id="' + data.icon + '"]').addClass('selected');
  }
}

function getAllIconsInArray() {
  for (var property in fontAwesomeIcons) {
    fontAwesomeIcons[property].forEach(function(icon) {
      allIcons.push(icon);
    });
  }
}

function init() {
  getAllIconsInArray();
  attachListeners();
  renderFullList(fontAwesomeIcons);
  Fliplet.Widget.emit('icon-clicked', {isSelected: !!$('.icon-item.selected').data('icon-id')});
}

Fliplet.Widget.onSaveRequest(function() {
  var iconSelected = $('.icon-item.selected').data('icon-id');
  data.icon = iconSelected ? iconSelected : '';

  Fliplet.Widget.save(data).then(function() {
    Fliplet.Widget.complete();
  });
});

init();