$(function () {

  function toggle_new_highschool_info() {
    let element = $("#id_highschool_not_listed")

    if ($(element).is(":checked")) {
      $("#div_id_new_highschool_name, #div_id_new_highschool_counselor_name, #div_id_new_highschool_counselor_email").show()

      $("#id_new_highschool_name").focus()
    } else {
      $("#div_id_new_highschool_name, #div_id_new_highschool_counselor_name, #div_id_new_highschool_counselor_email").hide()
    }
  }

  $(document).on('click', '#id_highschool_not_listed', function () {
    toggle_new_highschool_info()
  })

  toggle_new_highschool_info()

  $('#id_highschool').multipleSelect({
    filter: true,
    selectAll: false,
    single: true,
  })
})

jQuery(document).ready(function ($) {

  $("#id_password, #id_confirm_password").css("display", 'inline-block')
  $("#hint_id_password, #hint_id_confirm_password").before('<div class="input-group-append" style="display: inline-block"><span class="input-group-text show_password" style="margin-left: -8px; padding: 10px; border-radius: 0;"><i class="far fa-eye"></i></span></div>')

  $(document).on('click', '.show_password', function () {
    let prop_value = $("#id_password").prop('type');
    if (prop_value == 'text')
      prop_value = 'password'
    else
      prop_value = 'text'

    $("#id_password, #id_confirm_password").prop('type', prop_value)
  });

  $('#id_ssn, #id_verify_student_ssn').mask('000-00-0000');

  // $(".dateinput").datepicker()
});
