
$(function () {

  var menu = $(".us-autocomplete-pro-menu");
  var input = $("#id_mailing_address");
  var country_input = $("#id_country_of_residence");

  // $(input).insert('<ul class="us-autocomplete-pro-menu" style="display:none;"></ul>')

    // $(document).on('change', "#id_country_of_residence", function() {  
    //   if($(this).val() != 'US') {
    //     $("#id_city, #id_state, #id_zip_code").attr('readonly', false)
    //   } else {
    //     $("#id_city, #id_state, #id_zip_code").attr('readonly', true)
    //   }
    // });

  function getSuggestions(search, selected) {
    let country_code = $(country_input).val()
    
    if(search.length <= 4)
      return;
    
    // if(country_code != 'USA')
    //   return

    $.ajax({
      url: address_lookup,
      data: {
        // Don't forget to replace the auth-id value with your own Website Key
        "search": search,
        "country_code": (country_code ? country_code: ""),
        "selected": (selected ? selected : "")
      },
      // dataType: "jsonp",
      success: function (data) {
        if (data.suggestions) {
          buildMenu(data.suggestions);
        } else {
          noSuggestions();
        }
      },
      error: function (error) {
        return error;
      }
    });
  }

  function clearAddressData() {
    $("#city").val("");
    $("#state").val("");
    $("#zip").val("");
  }

  function noSuggestions() {
    var menu = $(".us-autocomplete-pro-menu");
    menu.empty();
    menu.append("<li class='ui-state-disabled'><div>No Suggestions Found</div></li>");
    menu.menu("refresh");
  }

  function buildAddress(suggestion) {
    var whiteSpace = "";
    
    if (suggestion.secondary || suggestion.entries > 1) {
      if (suggestion.entries > 1) {
        suggestion.secondary = (suggestion.secondary ? suggestion.secondary : "");

        suggestion.secondary += " (" + suggestion.entries + " more entries)";
      }
      whiteSpace = " ";
    }
      var address = suggestion.street_line + 
        whiteSpace + 
        (suggestion.secondary ? suggestion.secondary + ", " : ", ") +  
        (suggestion.city ? suggestion.city + ", " : "") + 
        (suggestion.state ? suggestion.state + " " : "") + 
        (suggestion.zipcode ? suggestion.zipcode + "" : "");

    var inputAddress = $("#id_mailing_address").val();
    for (var i = 0; i < address.length; i++) {
      var theLettersMatch = typeof inputAddress[i] == "undefined" || address[i].toLowerCase() !== inputAddress[i].toLowerCase();
      if (theLettersMatch) {
        address = [address.slice(0, i), "<b>", address.slice(i)].join("");
        break;
      }
    }
    return address;
  }

  function buildMenu(suggestions) {
    var menu = $(".us-autocomplete-pro-menu");
    menu.empty();

    console.log(suggestions.length)
    if(suggestions.length == 1) {
      if(!suggestions[0].address_id) {
        $("#id_mailing_address").val(suggestions[0].street_line);
        $("#id_city").val(suggestions[0].city);
        $("#id_state").val(suggestions[0].state);
        $("#id_zip_code").val(suggestions[0].zipcode);

        // console.log()
        // console.log(suggestions[0].city)
        // console.log(suggestions[0].state)
        // console.log(suggestions[0].zipcode)
      }
      $(".us-autocomplete-pro-menu").hide();
      return
    }

    suggestions.map(function (suggestion) {
      var caret = (suggestion.entries > 1 ? "<span class=\"ui-menu-icon ui-icon ui-icon-caret-1-e\"></span>" : "");

      menu.append("<li><div data-address='" +
        suggestion.street_line + (suggestion.secondary ? " " + suggestion.secondary : " ") + ";" +
        (suggestion.city ? " " + suggestion.city : "") + ";" +
        (suggestion.state ? " " + suggestion.state : "") + ";" +
        (suggestion.zipcode ? " " + suggestion.zipcode : "") + ";" +
        (suggestion.address_id ? " " + suggestion.address_id : "") + ";" +
         "' " + 
         " data-address_id='" + ( suggestion.address_id ? suggestion.address_id : "") + "' " + 
         ">" +
        caret +
        buildAddress(suggestion) + "</b></div></li>");
    });
    menu.menu("refresh");
  }

  $(".us-autocomplete-pro-menu").menu({
    select: function (event, ui) {
      var text = ui.item[0].innerText;
      var address = ui.item[0].childNodes[0].dataset.address.split(";");
      var address_id = ui.item[0].childNodes[0].dataset.address_id;

      if(address_id) {
        selected = address_id

        selected = selected.replace(",", "");
        getSuggestions(address[0], selected);
        return;
      }

      var searchForMoreEntriesText = new RegExp(/(?:\ more\ entries\))/);
      input.val(address[0]);
      $("#id_city").val(address[1]);
      $("#id_state").val(address[2]);
      $("#id_zip_code").val(address[3]);

      if (text.search(searchForMoreEntriesText) == "-1") {
        $(".us-autocomplete-pro-menu").hide();
      } else {
        $("#id_mailing_address").val(address[0] + " ");
        var selected = text.replace(" more entries", "");

        if(address_id)
          selected = address_id

        selected = selected.replace(",", "");
        getSuggestions(address[0], selected);
      }
    }
  });

  $("#id_mailing_address").keyup(function (event) {
    if (input.val().length > 0 || input.val() === "") clearAddressData();
    if (event.key === "ArrowDown") {
      menu.focus();
      menu.menu("focus", null, menu.menu().find(".ui-menu-item"));
    } else {
      var textInput = input.val();
      if (textInput) {
        menu.show();
        getSuggestions(textInput);
      } else {
        menu.hide();
      }
    }
  });

  $(".us-autocomplete-pro-menu").css("width", ($("#id_mailing_address").width() + 24) + "px")

});