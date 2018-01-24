
  var tour = new Shepherd.Tour({
    defaults: {
      classes: 'shepherd-theme-square-dark'
    }
  });

  tour.addStep('welcome', {
    title: "Welcome to API Navigator!",
    text: "Explore Box Platform's content services through this interacive web application. Each page highlights a unique set of platform capabilities.",
    showCancelLink: "true",
  });

  tour.addStep('interact', {
    title: "Interact",
    text: "Interact with the buttons on each page. Perform various actions like uploading a file, attaching metadata, searching for content, and more.",
    showCancelLink: "true",
    attachTo: '#tour2 bottom',
    when: {
      show: function() {
        $('#tour2').trigger('click');
      }
    }
  });

  tour.addStep('api', {
    title: "Request and Response",
    text: "Observe the corresponding Box API request and JSON response here",
    showCancelLink: "true",
    attachTo: '#tour3 bottom'
  });

  tour.addStep('end', {
    title: "That's It!",
    text: "Enjoy exploring the possibilities of Box Platform.",
    showCancelLink: "true",
    buttons: [
      {text: 'End',action: 'tour.end()'}
    ]
  });
