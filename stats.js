// Object som håller information om skott
function Marker(x, y, button) {
    var self = this;
    self.size = 10;
    
    self.x = (x - (self.size/2)) + "px";
    self.y = (y - (self.size/2)) + "px";
    self.size = self.size + "px";

    self.button = ko.observable(button);
    
    self.color = function() {
        return self.button().color;
    }
    
    self.changeButton = function(button) {
        if (self.button() != button) {
            self.button().count(self.button().count() - 1);
            self.button(button);
            self.button().count(self.button().count() + 1);
        }
    }
}

// Object som håller information om knapparna som ändrar Marker
function Button(text, color) {
    var self = this;
    self.text = text;
    self.count = ko.observable(0);
    self.color = color;

    self.buttonText = function() {
        var txt = self.text + ": " + self.count();;
        return txt;
    }
}

// Knockout viewModel
function AppViewModel() {
    var self = this;

    // Array för alla skott
    self.markers = ko.observableArray();
    // Standard-knappens index som används för nya skott. 0 = första knappen.
    var defaultButtonIndex = 1;

    // Definera upp alla knappar.
    self.buttons = [
        new Button( "Mål", "black"),
        new Button( "Skott på mål", "green"),
        new Button( "Skott utanför", "purple"),
        new Button( "Skott i täck", "gray"),
        new Button( "Skott över", "red"),
    ];

    // Skapa upp ett nytt skott och lägg in i array för dessa.
    // Räkna även upp skott-räknaren på default-knappen
    self.placeMarker = function(data, event) {
        var btn = self.buttons[defaultButtonIndex];
        self.markers.push(new Marker(event.pageX, event.pageY, btn));
        btn.count(btn.count() + 1);
    }

    // Uppdatera senaste skottet så det räknas som annan typ av skott
    self.updateMarker = function(data) {
        if (self.markers().length > 0) {
            self.markers()[self.markers().length - 1].changeButton(data);
        }
    }

    // Ta bort senaste skottet. Man kan radera alla skott, ett efter det andra.
    self.removeMarker = function(data) {
        if (self.markers().length > 0) {
            var marker = self.markers.pop();
            marker.button().count(marker.button().count() - 1);
        }
    }
}

// Starta knockout-bindningarna
ko.applyBindings(new AppViewModel());