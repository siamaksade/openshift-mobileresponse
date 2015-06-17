function NavigationController(visitorsFactory, $rootScope, $scope, $routeParams, $location) {
    
    $rootScope.visitorNumber = $routeParams.param1;

    // for chat helpdesk
    var phoneNumber = $rootScope.visitorNumber;
    
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    // Booking
    $scope.bookingLocations = ['[Sthlm] ARLANDA (Pionjärvägen 2)',
        '[Sthlm] BOTKYRKA (Fågelviksvägen 15)',
        '[Sthlm] HANINGE (Hantverkarvägen 36)',
        '[Sthlm] HÄGERSTEN (Kilabergsvägen 2)',
        '[Sthlm] KISTA (Danmarksgatan 52)',
        '[Sthlm] KUNGSÄNGEN (Mätarvägen 5 B)',
        '[Sthlm] SKÄRHOLMEN (Ekholmsvägen 19)',
        '[Sthlm] SOLNA (Solnavägen 15)',
        '[Sthlm] STOCKHOLM CITY (Birger Jarlsgatan 102)',
        '[Sthlm] STOCKHOLM HAMMARBY (Virkesvägen 24)',
        '[Sthlm] STOCKHOLM SÖDERMALM (Ringvägen 49)',
        '[Sthlm] TYRESÖ-ÄLTA (Grustagsvägen 6)',
        '[Sthlm] UPPSALA (Fyrislundsgatan 76)',
        '[Sthlm] VÄLLINGBY (Jämtlandsgatan 68)',
        '[Sthlm] ÅKERSBERGA (Rallarvägen 23)',
        '[Syd] BORÅS (Getängsvägen 29)',
        '[Syd] GÖTEBORG RINGÖN (Ringögatan 2)',
        '[Syd] GÖTEBORG SISJÖN (Hulda Mellgrensgata 9)',
        '[Syd] HALMSTAD (Stationsgatan 39)',
        '[Syd] HELSINGBORG (Juelsgatan 5)',
        '[Syd] JÖNKÖPING (Fridhemsvägen 29)',
        '[Syd] LINKÖPING (Södra Oskarsgatan 10)',
        '[Syd] LUND (Gnejsvägen 9)',
        '[Syd] MALMÖ FOSIE (Agnesfridsvägen 185 A)',
        '[Syd] MALMÖ LUNDAVÄGEN (Lundavägen 56)',
        '[Syd] NORRKÖPING (Malmgatan 31)',
        '[Syd] TROLLHÄTTAN (Grundbergsvägen 18)',
        '[Syd] UDDEVALLA (Västgötavägen 24)',
        '[Syd] VÄNERSBORG (Regementsgatan 41)',
        '[Norr] ESKILSTUNA (Mått Johanssons väg 18)',
        '[Norr] GÄVLE (Industrigatan 11)',
        '[Norr] KARLSTAD (Norra Infarten 70)',
        '[Norr] LULEÅ (Spantgatan 5)',
        '[Norr] SUNDSVALL (Kolvägen 22)',
        '[Norr] UMEÅ (Gräddvägen 19)',
        '[Norr] VÄSTERÅS (Fältmätargatan 22)',
        '[Norr] ÖREBRO (Idrottsvägen 29)',
        '[Norr] ÖRNSKÖLDSVIK (Skortsedsvägen 1)'];

    var contactResponses = {
        'booking': 'Partials/contactResponses/bookingAndPrice.html',
        'price': 'Partials/contactResponses/bookingAndPrice.html',
        'reschedule': 'Partials/contactResponses/reschedule.html',
        'additionalquestion': 'Partials/contactResponses/question.html',
        'invoicequestion': 'Partials/contactResponses/invoice.html',
        'claimquestion': 'Partials/contactResponses/claim.html',
        'otherquestion': 'Partials/contactResponses/question.html'
    };

    var groups = {
        'kundcenter': 'f8cbb4e3-2738-44ba-a7a9-54cc2a937c73',
        'ekonomi': '35d3b291-8f3f-4904-9fa7-b6346dc3293a'
    };

   
    $scope.openChat = function (code) {
       var startLinkResponse = SnapEngage.startLink();
        console.log('startLink: ' + startLinkResponse);

        var sendTextResponse1 = SnapEngage.sendTextToChat("[Express] Phone: " + code);
        console.log('sendTextToChat1: ' + sendTextResponse1);

        var baseUrl = window.location.href.substr(0, window.location.href.indexOf('#'));
        var sendTextResponse2 = SnapEngage.sendTextToChat("[Express] Helpdesk link: " +  baseUrl + '#/helpdesk/' + code);
        console.log('sendTextToChat2: ' + sendTextResponse2);
        
        return true;

    };

    $scope.requestsAnswerBySms = function(code, group) {
    	var baseUrl = window.location.href.substr(0, window.location.href.indexOf('#'));
        var message = "Hej, kunden har begärt att få svar via sms. Här kan du se ärendet: " + baseUrl + '#/helpdesk/' + code;
        var subject = "Express: " + group;
        visitorsFactory.sendEmail(code, groups[group], subject, message, function(response) {
            $scope.contactResponseMessage = "Tack vi har skickat din fråga";
        });
    };

    $scope.sendEmail = function (code, group) {
    	var baseUrl = window.location.href.substr(0, window.location.href.indexOf('#'));
        var message = "Hej, kunden har valt att skicka email. Här kan du se ärendet: " + baseUrl + '#/helpdesk/' + code;
        var subject = "Express: " + group;
        visitorsFactory.sendEmail(code, groups[group], subject, message, function(response) {
            $scope.contactResponseMessage = "Tack vi har skickat ditt meddelande";
        });
    };

    $scope.submitBooking = function (vrn, email, requestedDate, location) {
        $scope.contactResponseMessage = "";
        var metadata = {
            'lastsubmit': 'booking',
            'lastvisit': visitorsFactory.dateTimeNow(),
            'vrn': vrn,
            'email': email,
            'bookingdate': visitorsFactory.formatDate(requestedDate),
            'bookinglocation': location
        };
        visitorsFactory.setVisitorMetaData($rootScope.currentVisitor.id, metadata, function() {
            // call or chat
            $scope.bookingSubmitted = true;
            $scope.bookingResponse = contactResponses['booking'];
        });
    };
    
    // Price
    $scope.submitPrice = function (vrn, email) {
        $scope.contactResponseMessage = "";
        var metadata = {
            'lastsubmit': 'price',
            'lastvisit': visitorsFactory.dateTimeNow(),
            'vrn': vrn,
            'email': email
        };
        visitorsFactory.setVisitorMetaData($rootScope.currentVisitor.id, metadata, function () {
            //call or chat
            $scope.priceResponse = contactResponses['price'];
        });
    };

    // Reschedule
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.submitReschedule = function (vrn, requestedDate, requestedTime) {
        $scope.contactResponseMessage = "";
        var metadata = {
            'lastsubmit': 'reschedule',
            'lastvisit': visitorsFactory.dateTimeNow(),
            'vrn': vrn,
            'rescheduledate': visitorsFactory.formatDate(requestedDate),
            'rescheduletime': visitorsFactory.formatTime(requestedTime)
        };
        visitorsFactory.setVisitorMetaData($rootScope.currentVisitor.id, metadata, function () {
            // thank you
            $scope.rescheduleResponse = contactResponses['reschedule'];
            // send email?
            var baseUrl = window.location.href.substr(0, window.location.href.indexOf('#'));
            var message = "Hej, kunden har valt att omboka. Här kan du se ärendet: " + baseUrl + '#/helpdesk/' + $rootScope.visitorNumber;
            var subject = "Express: Kundcenter - Ombokning";
            visitorsFactory.sendEmail($rootScope.visitorNumber, groups['kundcenter'], subject, message, function (response) {
            });

        });
    };

    // Additional Question
    $scope.submitAdditionalQuestion = function (vrn, question) {
        $scope.contactResponseMessage = "";
        var metadata = {
            'lastsubmit': 'additionalquestion',
            'lastvisit': visitorsFactory.dateTimeNow(),
            'vrn': vrn,
            'additionalquestion': question
        };
        visitorsFactory.setVisitorMetaData($rootScope.currentVisitor.id, metadata, function () {
            // chat + skicka vidare som email
            $scope.additionalQuestionResponse = contactResponses['additionalquestion'];
        });
    };

    // Invoice Question
    $scope.submitInvoiceQuestion = function (vrn, question) {
        $scope.contactResponseMessage = "";
        var metadata = {
            'lastsubmit': 'invoicequestion',
            'lastvisit': visitorsFactory.dateTimeNow(),
            'vrn': vrn,
            'invoicequestion': question
        };
        visitorsFactory.setVisitorMetaData($rootScope.currentVisitor.id, metadata, function () {
            // call, chat, email ekonomi
            $scope.invoiceQuestionResponse = contactResponses['invoicequestion'];
        });
    };

    // Claim Question
    $scope.submitClaimQuestion = function (vrn, question) {
        $scope.contactResponseMessage = "";
        var metadata = {
            'lastsubmit': 'claimquestion',
            'lastvisit': visitorsFactory.dateTimeNow(),
            'vrn': vrn,
            'claimquestion': question
        };
        visitorsFactory.setVisitorMetaData($rootScope.currentVisitor.id, metadata, function () {
            // call, chat
            $scope.claimQuestionResponse = contactResponses['claimquestion'];
        });
    };

    // Other Question
    $scope.submitOtherQuestion = function (vrn, question) {
        $scope.contactResponseMessage = "";
        var metadata = {
            'lastsubmit': 'otherquestion',
            'lastvisit': visitorsFactory.dateTimeNow(),
            'vrn': vrn,
            'otherquestion': question
        };
        visitorsFactory.setVisitorMetaData($rootScope.currentVisitor.id, metadata, function () {
            // call, chat, email kundcenter 
            $scope.otherQuestionResponse = contactResponses['otherquestion'];
        });
    };

}