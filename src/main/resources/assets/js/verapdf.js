$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
  numFiles = input.get(0).files ? input.get(0).files.length : 1,
  label = input.val().replace(/\\/g, '/').replace(/.*\//, ''),
  rusha = new Rusha(),
  file = input.get(0).files[0],
  reader = new FileReader();
  reader.onload = function(e) {
    var rawData = reader.result;
    var digest = rusha.digest(rawData);
    input.trigger('fileselect', [numFiles, label, digest]);
  }
  reader.readAsBinaryString(file);
});

$(document).ready( function() {
  $('.btn-file :file').on('fileselect', function(event, numFiles, label, digest) {
    var input = $(this).parents('.input-group').find(':text'),
    log = numFiles > 1 ? numFiles + ' files selected' : label;

    if( input.length ) {
      input.val(log);
    } else {
      if( log ) alert(log);
    }
    $("#sha1Hex").val(digest);
  });
});

$(document).ready(function () {

  var navListItems = $('div.setup-panel div a'),
  allWells = $('.setup-content'),
  allPreviousBtn = $('.previousBtn');
  allNextBtn = $('.nextBtn');

  allWells.hide();

  navListItems.click(function (e) {
    e.preventDefault();
    var $target = $($(this).attr('href')),
    $item = $(this);

    if (!$item.hasClass('disabled')) {
      navListItems.removeClass('btn-primary').addClass('btn-default');
      $item.addClass('btn-primary');
      allWells.hide();
      $target.show();
      $target.find('input:eq(0)').focus();
    }
  });

  allNextBtn.click(function(){
    var curStep = $(this).closest(".setup-content"),
    curStepBtn = curStep.attr("id"),
    nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
    curInputs = curStep.find("input[type='text'],input[type='url']"),
    isValid = true;
    $(".form-group").removeClass("has-error");
    for(var i=0; i<curInputs.length; i++){
      if (!curInputs[i].validity.valid){
        isValid = false;
        $(curInputs[i]).closest(".form-group").addClass("has-error");
      }
    }

    if (isValid)
    nextStepWizard.removeAttr('disabled').trigger('click');
    if (curStepBtn == 'configure') callVeraPdfService();
  });

  allPreviousBtn.click(function(){
    var curStep = $(this).closest(".setup-content"),
    curStepBtn = curStep.attr("id"),
    nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children("a"),
    curInputs = curStep.find("input[type='text'],input[type='url']"),
    isValid = true;
    $(".form-group").removeClass("has-error");
    for(var i=0; i<curInputs.length; i++){
      if (!curInputs[i].validity.valid){
        isValid = false;
        $(curInputs[i]).closest(".form-group").addClass("has-error");
      }
    }

    if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
  });

  $('div.setup-panel div a.btn-primary').trigger('click');
});

var flavour = "1b";

function changeFlavour(newFlavour) {
  flavour = newFlavour;
}

var outputFormat = "html"

function changeOutputFormat(newFormat) {
  outputFormat = newFormat;
}

function callVeraPdfService() {
  var formData = new FormData($('form')[0]);

  $("#results").empty();
  var spinHtml = $("#spinner-template").html();
  $("#results").html(spinHtml);
  pdfaValidator.validate(formData, flavour, function() {
    renderResult();
  }, outputFormat);
}

function renderResult() {
  $("#results").empty();
  if (outputFormat ==  'html') {
    $('#results').html(pdfaValidator.result);
  } else {
    var preBlock = $("<pre>").text(pdfaValidator.result);
    $("#results").append(preBlock);
  }
}
