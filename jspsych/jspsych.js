/* eslint-disable */
var jsPsych = (function () {
  'use strict';
  var globalJsPsych;
  var version = '7.3.3';
  var defaults = {
    display_element: undefined,
    on_finish: function () {},
    on_close: function () {},
    on_data_update: function () {},
    on_data_collection_start: function () {},
    on_trial_start: function () {},
    on_trial_finish: function () {},
    on_timeline_start: function () {},
    on_timeline_finish: function () {},
    on_interaction_data_update: function () {},
    on_page_load: function () {},
    auto_update_progress_bar: true,
    show_progress_bar: false,
    message_progress_bar: 'Progress',
    auto_preload: true,
    max_load_time: 60000,
    default_iti: 0,
    minimum_valid_rt: 0,
    exclusions: {},
    show_preload_progress_bar: true,
    microdata: {},
    use_modern_defaults: false,
  };
  var DataCollection = /** @class */ (function () {
    function DataCollection(data) {
      if (data === void 0) {
        data = [];
      }
      this.data = data;
    }
    DataCollection.prototype.push = function (data) {
      this.data.push(data);
    };
    DataCollection.prototype.values = function () {
      return this.data;
    };
    DataCollection.prototype.filter = function (query) {
      var filter_function = function (x) {
        var keep = true;
        for (var key in query) {
          if (query.hasOwnProperty(key)) {
            if (typeof x[key] === 'undefined' || x[key] != query[key]) {
              keep = false;
            }
          }
        }
        return keep;
      };
      var filtered_data = this.data.filter(filter_function);
      return new DataCollection(filtered_data);
    };
    DataCollection.prototype.filterCustom = function (filter) {
      var filtered_data = this.data.filter(filter);
      return new DataCollection(filtered_data);
    };
    DataCollection.prototype.map = function (func) {
      var mapped_data = this.data.map(func);
      return new DataCollection(mapped_data);
    };
    DataCollection.prototype.reduce = function (func, initial_value) {
      var reduced_data = this.data.reduce(func, initial_value);
      return reduced_data;
    };
    DataCollection.prototype.each = function (func) {
      this.data.forEach(func);
      return this;
    };
    DataCollection.prototype.select = function (column) {
      var data = this.data.map(function (x) {
        return x[column];
      });
      return new DataCollection(data);
    };
    DataCollection.prototype.unique = function (column) {
      var data = this.select(column).values();
      var unique_data = [];
      for (var i = 0; i < data.length; i++) {
        if (unique_data.indexOf(data[i]) === -1) {
          unique_data.push(data[i]);
        }
      }
      return new DataCollection(unique_data);
    };
    DataCollection.prototype.exclude = function (query) {
      var filter_function = function (x) {
        var keep = true;
        for (var key in query) {
          if (query.hasOwnProperty(key)) {
            if (typeof x[key] !== 'undefined' && x[key] == query[key]) {
              keep = false;
            }
          }
        }
        return keep;
      };
      var filtered_data = this.data.filter(filter_function);
      return new DataCollection(filtered_data);
    };
    DataCollection.prototype.join = function (data_two, column) {
      if (
        this.data.length == 0 ||
        data_two.values().length == 0 ||
        typeof this.data[0][column] === 'undefined' ||
        typeof data_two.values()[0][column] === 'undefined'
      ) {
        return this;
      }
      var joined_data = [];
      for (var i = 0; i < this.data.length; i++) {
        for (var j = 0; j < data_two.values().length; j++) {
          if (this.data[i][column] == data_two.values()[j][column]) {
            joined_data.push(Object.assign({}, this.data[i], data_two.values()[j]));
          }
        }
      }
      return new DataCollection(joined_data);
    };
    DataCollection.prototype.joinCustom = function (data_two, filter_function) {
      var joined_data = [];
      for (var i = 0; i < this.data.length; i++) {
        for (var j = 0; j < data_two.values().length; j++) {
          if (filter_function(this.data[i], data_two.values()[j])) {
            joined_data.push(Object.assign({}, this.data[i], data_two.values()[j]));
          }
        }
      }
      return new DataCollection(joined_data);
    };
    DataCollection.prototype.merge = function (data_two) {
      var merged_data = this.data.concat(data_two.values());
      return new DataCollection(merged_data);
    };
    DataCollection.prototype.sort = function (column, ascending) {
      if (ascending === void 0) {
        ascending = true;
      }
      var sorted_data = this.data.slice(0).sort(function (a, b) {
        var x = a[column];
        var y = b[column];
        if (x < y) {
          return ascending ? -1 : 1;
        }
        if (x > y) {
          return ascending ? 1 : -1;
        }
        return 0;
      });
      return new DataCollection(sorted_data);
    };
    DataCollection.prototype.sortCustom = function (func) {
      var sorted_data = this.data.slice(0).sort(func);
      return new DataCollection(sorted_data);
    };
    DataCollection.prototype.sample = function (size, replace) {
      if (replace === void 0) {
        replace = false;
      }
      var data = this.data.slice(0);
      var sampled_data = [];
      for (var i = 0; i < size; i++) {
        var index = Math.floor(Math.random() * data.length);
        sampled_data.push(data[index]);
        if (!replace) {
          data.splice(index, 1);
        }
      }
      return new DataCollection(sampled_data);
    };
    DataCollection.prototype.count = function () {
      return this.data.length;
    };
    DataCollection.prototype.min = function (column) {
      var data = this.select(column).values();
      return Math.min.apply(null, data);
    };
    DataCollection.prototype.max = function (column) {
      var data = this.select(column).values();
      return Math.max.apply(null, data);
    };
    DataCollection.prototype.mean = function (column) {
      var data = this.select(column).values();
      var sum = data.reduce(function (a, b) {
        return a + b;
      }, 0);
      return sum / data.length;
    };
    DataCollection.prototype.median = function (column) {
      var data = this.select(column).values();
      var sorted_data = data.sort(function (a, b) {
        return a - b;
      });
      var median_index = Math.floor(sorted_data.length / 2);
      if (sorted_data.length % 2 == 1) {
        return sorted_data[median_index];
      } else {
        return (sorted_data[median_index - 1] + sorted_data[median_index]) / 2;
      }
    };
    DataCollection.prototype.sd = function (column) {
      var data = this.select(column).values();
      var mean = this.mean(column);
      var squared_difference = data.map(function (x) {
        return Math.pow(x - mean, 2);
      });
      var sum_squared_difference = squared_difference.reduce(function (a, b) {
        return a + b;
      }, 0);
      var variance = sum_squared_difference / data.length;
      return Math.sqrt(variance);
    };
    DataCollection.prototype.json = function (pretty) {
      if (pretty === void 0) {
        pretty = false;
      }
      if (pretty) {
        return JSON.stringify(this.data, null, 2);
      }
      return JSON.stringify(this.data);
    };
    DataCollection.prototype.csv = function (include_header, separator) {
      if (include_header === void 0) {
        include_header = true;
      }
      if (separator === void 0) {
        separator = ',';
      }
      var data_flat = this.data.map(function (x) {
        var flat = {};
        for (var key in x) {
          if (x.hasOwnProperty(key)) {
            if (x[key] !== null && typeof x[key] === 'object' && !Array.isArray(x[key])) {
              for (var nested_key in x[key]) {
                if (x[key].hasOwnProperty(nested_key)) {
                  flat[key + '.' + nested_key] = x[key][nested_key];
                }
              }
            } else {
              flat[key] = x[key];
            }
          }
        }
        return flat;
      });
      var keys = [];
      data_flat.forEach(function (x) {
        for (var key in x) {
          if (x.hasOwnProperty(key) && keys.indexOf(key) === -1) {
            keys.push(key);
          }
        }
      });
      var csv = '';
      if (include_header) {
        csv += keys.join(separator) + '\n';
      }
      data_flat.forEach(function (x) {
        var row = [];
        keys.forEach(function (key) {
          var value = x[key];
          if (typeof value === 'undefined' || value === null) {
            row.push('');
          } else if (typeof value === 'string' || typeof value === 'number') {
            var string_value = String(value);
            if (string_value.indexOf('"') > -1) {
              string_value = string_value.replace(/"/g, '""');
            }
            if (string_value.indexOf(separator) > -1 || string_value.indexOf('\n') > -1) {
              string_value = '"' + string_value + '"';
            }
            row.push(string_value);
          } else {
            row.push(JSON.stringify(value));
          }
        });
        csv += row.join(separator) + '\n';
      });
      return csv;
    };
    DataCollection.prototype.localSave = function (format, filename, include_header, separator) {
      if (include_header === void 0) {
        include_header = true;
      }
      if (separator === void 0) {
        separator = ',';
      }
      var data_string;
      if (format == 'json') {
        data_string = this.json(true);
      } else {
        data_string = this.csv(include_header, separator);
      }
      var blob = new Blob([data_string], {
        type: 'text/' + format + ';charset=utf-8',
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    return DataCollection;
  })();
  var utils = {
    shuffle: function (array) {
      var j, x, i;
      for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
      }
      return array;
    },
    randomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomDouble: function (min, max) {
      return Math.random() * (max - min) + min;
    },
    randomChoice: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },
    sampleExGaussian: function (mu, sigma, lambda, positive) {
      if (positive === void 0) {
        positive = true;
      }
      var normal = 0;
      var exponential = 0;
      while (normal === 0) {
        var u1 = Math.random();
        var u2 = Math.random();
        var z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        normal = z * sigma + mu;
      }
      while (exponential === 0) {
        exponential = -Math.log(Math.random()) * lambda;
      }
      var result = normal + exponential;
      if (positive && result < 0) {
        return this.sampleExGaussian(mu, sigma, lambda, positive);
      }
      return result;
    },
    sampleNormal: function (mu, sigma) {
      var normal = 0;
      while (normal === 0) {
        var u1 = Math.random();
        var u2 = Math.random();
        var z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        normal = z * sigma + mu;
      }
      return normal;
    },
    sampleExponential: function (lambda) {
      return -Math.log(Math.random()) * lambda;
    },
    setTimeout: function (callback, delay) {
      return setTimeout(callback, delay);
    },
    clearTimeout: function (timeout) {
      clearTimeout(timeout);
    },
    addEventListener: function (element, event, callback, options) {
      if (options === void 0) {
        options = false;
      }
      element.addEventListener(event, callback, options);
    },
    removeEventListener: function (element, event, callback, options) {
      if (options === void 0) {
        options = false;
      }
      element.removeEventListener(event, callback, options);
    },
    preventDefault: function (event) {
      event.preventDefault();
    },
    getKeys: function (callback_function, valid_responses, rt_method, persist, allow_held_key) {
      if (valid_responses === void 0) {
        valid_responses = 'ALL_KEYS';
      }
      if (rt_method === void 0) {
        rt_method = 'performance';
      }
      if (persist === void 0) {
        persist = false;
      }
      if (allow_held_key === void 0) {
        allow_held_key = false;
      }
      var keyboard_listener = new KeyboardListener();
      keyboard_listener.setCallback(callback_function);
      keyboard_listener.setValidResponses(valid_responses);
      keyboard_listener.setRtMethod(rt_method);
      keyboard_listener.setPersist(persist);
      keyboard_listener.setAllowHeldKey(allow_held_key);
      keyboard_listener.start();
      return keyboard_listener;
    },
    data: {
      get: function () {
        return globalJsPsych.data.get();
      },
      getLastTrialData: function () {
        return globalJsPsych.data.getLastTrialData();
      },
      addProperties: function (properties) {
        globalJsPsych.data.addProperties(properties);
      },
      addTrialData: function (data) {
        globalJsPsych.data.addTrialData(data);
      },
      getInteractionData: function () {
        return globalJsPsych.data.getInteractionData();
      },
      addInteractionData: function (data) {
        globalJsPsych.data.addInteractionData(data);
      },
    },
    pluginAPI: {
      get : function (parameters) {
        return globalJsPsych.pluginAPI.get (parameters);
      },
      killKeyboardListeners: function () {
        globalJsPsych.pluginAPI.killKeyboardListeners();
      },
      setTimeout: function (callback, delay) {
        return globalJsPsych.pluginAPI.setTimeout(callback, delay);
      },
      clearAllTimeouts: function () {
        globalJsPsych.pluginAPI.clearAllTimeouts();
      },
    },
    randomization: {
      shuffle: function (array) {
        return globalJsPsych.randomization.shuffle(array);
      },
      sampleWithoutReplacement: function (array, size) {
        return globalJsPsych.randomization.sampleWithoutReplacement(array, size);
      },
      repeat: function (array, repetitions) {
        return globalJsPsych.randomization.repeat(array, repetitions);
      },
      factorial: function (factors, repetitions, randomize_sample) {
        return globalJsPsych.randomization.factorial(factors, repetitions, randomize_sample);
      },
      shuffleWithinGroups: function (array, groups) {
        return globalJsPsych.randomization.shuffleWithinGroups(array, groups);
      },
      shuffleColumns: function (array) {
        return globalJsPsych.randomization.shuffleColumns(array);
      },
      sampleExGaussian: function (mu, sigma, lambda, positive) {
        return globalJsPsych.randomization.sampleExGaussian(mu, sigma, lambda, positive);
      },
    },
  };
  var Data = /** @class */ (function () {
    function Data(jsPsych) {
      this.jsPsych = jsPsych;
      this.trial_data = new DataCollection();
      this.interaction_data = new DataCollection();
      this.experiment_properties = {};
    }
    Data.prototype.get = function () {
      return this.trial_data;
    };
    Data.prototype.getLastTrialData = function () {
      return this.trial_data.filterCustom(function (x) {
        return x.trial_index === globalJsPsych.timeline.getCurrentTrialIndex();
      });
    };
    Data.prototype.addProperties = function (properties) {
      Object.assign(this.experiment_properties, properties);
    };
    Data.prototype.addTrialData = function (data) {
      var trial_data = Object.assign({}, data);
      Object.assign(trial_data, this.experiment_properties);
      trial_data.time_elapsed = Math.round(performance.now() - this.jsPsych.init_time);
      trial_data.trial_index = this.jsPsych.timeline.getCurrentTrialIndex();
      trial_data.internal_node_id = this.jsPsych.timeline.getInternalID();
      trial_data.jspsych_version = version;
      this.trial_data.push(trial_data);
      this.jsPsych.options.on_data_update(trial_data);
    };
    Data.prototype.getInteractionData = function () {
      return this.interaction_data;
    };
    Data.prototype.addInteractionData = function (data) {
      var interaction_data = Object.assign({}, data);
      interaction_data.time = Math.round(performance.now() - this.jsPsych.init_time);
      this.interaction_data.push(interaction_data);
      this.jsPsych.options.on_interaction_data_update(interaction_data);
    };
    Data.prototype.clear = function () {
      this.trial_data = new DataCollection();
      this.interaction_data = new DataCollection();
    };
    return Data;
  })();
  var KeyboardListener = /** @class */ (function () {
    function KeyboardListener() {
      this.callback = function () {};
      this.valid_responses = 'ALL_KEYS';
      this.rt_method = 'performance';
      this.persist = false;
      this.allow_held_key = false;
      this.keys_pressed = {};
      this.is_running = false;
      this.start_time = 0;
      this.response = {
        rt: null,
        key: null,
      };
      this.event_handler = this.event_handler.bind(this);
    }
    KeyboardListener.prototype.setCallback = function (callback) {
      this.callback = callback;
    };
    KeyboardListener.prototype.setValidResponses = function (valid_responses) {
      this.valid_responses = valid_responses;
    };
    KeyboardListener.prototype.setRtMethod = function (rt_method) {
      this.rt_method = rt_method;
    };
    KeyboardListener.prototype.setPersist = function (persist) {
      this.persist = persist;
    };
    KeyboardListener.prototype.setAllowHeldKey = function (allow_held_key) {
      this.allow_held_key = allow_held_key;
    };
    KeyboardListener.prototype.start = function () {
      if (this.is_running) {
        return;
      }
      this.is_running = true;
      this.keys_pressed = {};
      this.start_time = this.getRtMethod() == 'performance' ? performance.now() : Date.now();
      window.addEventListener('keydown', this.event_handler);
      window.addEventListener('keyup', this.event_handler);
    };
    KeyboardListener.prototype.stop = function () {
      if (!this.is_running) {
        return;
      }
      this.is_running = false;
      window.removeEventListener('keydown', this.event_handler);
      window.removeEventListener('keyup', this.event_handler);
    };
    KeyboardListener.prototype.getRtMethod = function () {
      return this.rt_method;
    };
    KeyboardListener.prototype.event_handler = function (event) {
      if (event.type == 'keydown') {
        if (!this.keys_pressed[event.key]) {
          this.keys_pressed[event.key] = true;
          this.handleResponse(event.key, event.timeStamp);
        } else if (this.allow_held_key) {
          this.handleResponse(event.key, event.timeStamp);
        }
      } else if (event.type == 'keyup') {
        this.keys_pressed[event.key] = false;
      }
    };
    KeyboardListener.prototype.handleResponse = function (key, timestamp) {
      var rt = Math.round(timestamp - this.start_time);
      var response = {
        rt: rt,
        key: key,
      };
      if (this.valid_responses === 'ALL_KEYS' || this.valid_responses.indexOf(key) !== -1) {
        this.response = response;
        if (!this.persist) {
          this.stop();
        }
        this.callback(response);
      }
    };
    return KeyboardListener;
  })();
  var Randomization = /** @class */ (function () {
    function Randomization() {}
    Randomization.prototype.shuffle = function (array) {
      return utils.shuffle(array);
    };
    Randomization.prototype.sampleWithoutReplacement = function (array, size) {
      var shuffled = utils.shuffle(array.slice(0));
      return shuffled.slice(0, size);
    };
    Randomization.prototype.repeat = function (array, repetitions) {
      var repeated = [];
      for (var i = 0; i < repetitions; i++) {
        repeated = repeated.concat(array);
      }
      return repeated;
    };
    Randomization.prototype.factorial = function (factors, repetitions, randomize_sample) {
      if (repetitions === void 0) {
        repetitions = 1;
      }
      if (randomize_sample === void 0) {
        randomize_sample = true;
      }
      var factor_keys = Object.keys(factors);
      if (factor_keys.length === 0) {
        return [];
      }
      var combinations = [];
      var factor_values = factor_keys.map(function (x) {
        return factors[x];
      });
      var num_factors = factor_keys.length;
      var factor_repetitions = factor_values.map(function (x) {
        return x.length;
      });
      var num_combinations = factor_repetitions.reduce(function (a, b) {
        return a * b;
      }, 1);
      for (var i = 0; i < num_combinations; i++) {
        var combination = {};
        var temp = i;
        for (var j = 0; j < num_factors; j++) {
          var factor_index = temp % factor_repetitions[j];
          combination[factor_keys[j]] = factor_values[j][factor_index];
          temp = Math.floor(temp / factor_repetitions[j]);
        }
        combinations.push(combination);
      }
      var repeated_combinations = this.repeat(combinations, repetitions);
      if (randomize_sample) {
        return this.shuffle(repeated_combinations);
      }
      return repeated_combinations;
    };
    Randomization.prototype.shuffleWithinGroups = function (array, groups) {
      var shuffled = [];
      var unique_groups = Array.from(new Set(groups));
      unique_groups.forEach(function (group) {
        var group_indices = [];
        for (var i = 0; i < array.length; i++) {
          if (groups[i] == group) {
            group_indices.push(i);
          }
        }
        var group_array = group_indices.map(function (i) {
          return array[i];
        });
        var shuffled_group = utils.shuffle(group_array);
        for (var i = 0; i < group_indices.length; i++) {
          shuffled[group_indices[i]] = shuffled_group[i];
        }
      });
      return shuffled;
    };
    Randomization.prototype.shuffleColumns = function (array) {
      var shuffled = array.map(function (x) {
        return x.slice(0);
      });
      var num_rows = shuffled.length;
      var num_cols = shuffled[0].length;
      for (var i = 0; i < num_cols; i++) {
        var column = [];
        for (var j = 0; j < num_rows; j++) {
          column.push(shuffled[j][i]);
        }
        var shuffled_column = utils.shuffle(column);
        for (var j = 0; j < num_rows; j++) {
          shuffled[j][i] = shuffled_column[j];
        }
      }
      return shuffled;
    };
    Randomization.prototype.sampleExGaussian = function (mu, sigma, lambda, positive) {
      if (positive === void 0) {
        positive = true;
      }
      return utils.sampleExGaussian(mu, sigma, lambda, positive);
    };
    return Randomization;
  })();
  var PluginAPI = /** @class */ (function () {
    function PluginAPI(jsPsych) {
      this.jsPsych = jsPsych;
      this.timeout_handlers = [];
      this.keyboard_listeners = [];
    }
    PluginAPI.prototype.get = function (parameters) {
      var keyboard_listener = utils.getKeys(
        parameters.callback_function,
        parameters.valid_responses,
        parameters.rt_method,
        parameters.persist,
        parameters.allow_held_key
      );
      this.keyboard_listeners.push(keyboard_listener);
      return keyboard_listener;
    };
    PluginAPI.prototype.killKeyboardListeners = function () {
      this.keyboard_listeners.forEach(function (listener) {
        listener.stop();
      });
      this.keyboard_listeners = [];
    };
    PluginAPI.prototype.setTimeout = function (callback, delay) {
      var timeout_id = utils.setTimeout(callback, delay);
      this.timeout_handlers.push(timeout_id);
      return timeout_id;
    };
    PluginAPI.prototype.clearAllTimeouts = function () {
      this.timeout_handlers.forEach(function (id) {
        utils.clearTimeout(id);
      });
      this.timeout_handlers = [];
    };
    return PluginAPI;
  })();
  var Timeline = /** @class */ (function () {
    function Timeline(jsPsych) {
      this.jsPsych = jsPsych;
      this.timeline = [];
      this.current_timeline_node_id = '';
      this.current_trial_index = 0;
      this.current_trial_type = '';
      this.internal_id_counter = 0;
    }
    Timeline.prototype.addTimeline = function (timeline) {
      this.timeline = this.timeline.concat(this.loadTimeline(timeline));
    };
    Timeline.prototype.loadTimeline = function (timeline, parent_id) {
      var _this = this;
      if (parent_id === void 0) {
        parent_id = '';
      }
      if (Array.isArray(timeline)) {
        var nodes = [];
        timeline.forEach(function (node) {
          nodes = nodes.concat(_this.loadTimelineNode(node, parent_id));
        });
        return nodes;
      }
      return this.loadTimelineNode(timeline, parent_id);
    };
    Timeline.prototype.loadTimelineNode = function (node, parent_id) {
      var _this = this;
      var timeline = [];
      var internal_id = this.generateInternalID();
      var node_id = parent_id ? parent_id + '-' + internal_id : internal_id;
      var timeline_variables = node.timeline_variables || [{}];
      if (node.randomize_timeline_variables) {
        timeline_variables = utils.shuffle(timeline_variables);
      }
      if (node.repetitions) {
        timeline_variables = utils.repeat(timeline_variables, node.repetitions);
      }
      timeline_variables.forEach(function (variable) {
        var timeline_node = Object.assign({}, node);
        Object.assign(timeline_node, variable);
        timeline_node.internal_node_id = node_id;
        if (timeline_node.timeline) {
          var nested_timeline = _this.loadTimeline(timeline_node.timeline, node_id);
          timeline = timeline.concat(nested_timeline);
        } else {
          timeline.push(timeline_node);
        }
      });
      if (node.timeline_variables && node.randomize_timeline) {
        return utils.shuffle(timeline);
      }
      return timeline;
    };
    Timeline.prototype.generateInternalID = function () {
      this.internal_id_counter++;
      return this.internal_id_counter.toString();
    };
    Timeline.prototype.start = function () {
      if (this.timeline.length === 0) {
        this.jsPsych.finishExperiment();
        return;
      }
      this.jsPsych.options.on_timeline_start(this.timeline[this.current_trial_index]);
      this.runNextTrial();
    };
    Timeline.prototype.runNextTrial = function () {
      if (this.current_trial_index >= this.timeline.length) {
        this.jsPsych.finishExperiment();
        return;
      }
      this.jsPsych.options.on_trial_start(this.timeline[this.current_trial_index]);
      this.runTrial(this.timeline[this.current_trial_index]);
    };
    Timeline.prototype.runTrial = function (trial) {
      var _this = this;
      var plugin = this.jsPsych.plugins[trial.type];
      if (!plugin) {
        console.error("No plugin found for trial type '" + trial.type + "'");
        this.jsPsych.finishExperiment();
        return;
      }
      this.current_timeline_node_id = trial.internal_node_id;
      this.current_trial_type = trial.type;
      plugin.trial(this.jsPsych.getDisplayElement(), trial, function (data) {
        _this.finishTrial(data);
      });
    };
    Timeline.prototype.finishTrial = function (data) {
      this.jsPsych.data.addTrialData(data);
      this.jsPsych.options.on_trial_finish(data);
      this.current_trial_index++;
      this.runNextTrial();
    };
    Timeline.prototype.getCurrentTrialIndex = function () {
      return this.current_trial_index;
    };
    Timeline.prototype.getInternalID = function () {
      return this.current_timeline_node_id;
    };
    return Timeline;
  })();
  var JsPsych = /** @class */ (function () {
    function JsPsych(options) {
      this.options = Object.assign({}, defaults, options);
      this.init_time = performance.now();
      this.is_running = false;
      this.plugins = {};
      this.data = new Data(this);
      this.timeline = new Timeline(this);
      this.pluginAPI = new PluginAPI(this);
      this.randomization = new Randomization();
      globalJsPsych = this;
      this.initDisplay();
      this.attachEventListeners();
    }
    JsPsych.prototype.initDisplay = function () {
      var display_element = this.options.display_element || document.body;
      var jspsych_container = document.createElement('div');
      jspsych_container.id = 'jspsych-content';
      display_element.appendChild(jspsych_container);
    };
    JsPsych.prototype.attachEventListeners = function () {
      var _this = this;
      window.addEventListener('blur', function () {
        _this.data.addInteractionData({
          event: 'blur',
          trial: _this.timeline.getCurrentTrialIndex(),
        });
      });
      window.addEventListener('focus', function () {
        _this.data.addInteractionData({
          event: 'focus',
          trial: _this.timeline.getCurrentTrialIndex(),
        });
      });
      window.addEventListener('resize', function () {
        _this.data.addInteractionData({
          event: 'resize',
          trial: _this.timeline.getCurrentTrialIndex(),
        });
      });
    };
    JsPsych.prototype.getDisplayElement = function () {
      return document.getElementById('jspsych-content');
    };
    JsPsych.prototype.registerPlugin = function (plugin_id, plugin) {
      this.plugins[plugin_id] = plugin;
    };
    JsPsych.prototype.run = function (timeline) {
      if (this.is_running) {
        console.warn('The experiment is already running. You cannot run it again.');
        return;
      }
      this.is_running = true;
      this.timeline.addTimeline(timeline);
      this.timeline.start();
    };
    JsPsych.prototype.finishExperiment = function () {
      this.is_running = false;
      this.options.on_finish(this.data.get());
      this.getDisplayElement().innerHTML = '';
    };
    JsPsych.prototype.version = function () {
      return version;
    };
    return JsPsych;
  })();
  function initJsPsych(options) {
    return new JsPsych(options);
  }
  return {
    initJsPsych: initJsPsych,
  };
})();
