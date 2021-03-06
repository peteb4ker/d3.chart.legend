(function (d3) {
  var markersLayer,
    labelsLayer;

  d3.chart('Legend', {
    initialize: function (options) {
      var group,
        legendGroup,
        markersGroup,
        title;

      options = typeof options === 'object' ? options : {};
      this.markerRadius(options.markerRadius || 5);
      this.colors(options.colors || d3.scale.category20());
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.orientation = options.orientation || "v";
      this.hOffset = options.hOffset || 50;

      group = this.base.append('g')
        .attr('class', 'legend')
        .attr('transform', translate(this.x, this.y));

      if (options.title) {
        title = group.append('text')
          .attr('class', 'legend-title')
          .attr('dx', 5)
          .text(options.title);
      }

      legendGroup = group.append('g')
        .attr('class', 'legend-group')
        .attr('transform', function () {
          return options.title ? translate(0, 10) : translate(0);
        });

      // Groups
      markersGroup = legendGroup.append('g')
        .attr('class', 'markers-group');

      // Layers init
      this.layer('markers', markersGroup, markersLayer);
    },

    transform: function (data) {
      var results = [],
        value,
        item;

      for (item in data) {
        if (data.hasOwnProperty(item)) {
          item = data[item];

          if (item) {
            if (typeof item === 'string') {
              results.push(item);
            }
            else if (item.label) {
              results.push(item.label);
            }
          }
        }
      }

      return results;
    },

    markerRadius: function (radius) {
      if (arguments.length === 0) {
        return this.markerR;
      }

      this.markerR = radius;
      return this;
    },

    colors: function (colors) {
      if (arguments.length === 0) {
        return this.color;
      }

      if (typeof colors === 'function') {
        this.color = colors;
      }
      else if (Array.isArray(colors)) {
        this.color = function (i) {
          return colors[i] || '#333333';
        };
      }

      return this;
    }
  });

  markersLayer = {
    dataBind: function (data) {
      return this.selectAll('g').data(data);
    },

    insert: function () {
        var group = this.insert("g").classed("marker-group", true);
        group.append("svg:circle");
        return group.append("svg:text");
    },

    events: {
      merge: function () {
        var chart = this.chart();

        //update marker circles
        this.select("circle").attr('class', 'marker')
          .attr('fill', function (d, i) {
            return chart.color(i);
          })
          .attr('cx', function (d, i) {
            return (chart.orientation === "v") ? 0 : (i * chart.hOffset) + 10;
          })
          .attr('cy', function (d, i) {
            return (chart.orientation === "v") ? (i * 20) + 10 : 0;
          })
          .attr('r', chart.markerR);

        //update marker text
        return this.select("text")
          .attr('x', function (d, i) {
              return (chart.orientation === "v") ? 9 + chart.markerR : (i * chart.hOffset) + 16 + chart.markerR;
          })
          .attr('y', function (d, i) {
            return (chart.orientation === "v") ? (i * 20) + 11 + chart.markerR / 2 : chart.markerR / 2;
          })
          .text(function (d) {
            return d;
          });
      },

      exit: function () {
        return this.remove();
      }
    }
  };

  function translate (x, y) {
    if (arguments && arguments.length === 1) {
      y = x;
    }

    return 'translate(' + x + ',' + y + ')';
  }
}(d3));
