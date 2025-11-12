/* eslint-disable */
var jspsychImageKeyboardResponse = (function (jspsych) {
  'use strict';
  const info = {
    name: 'image-keyboard-response',
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        pretty_name: 'Choices',
        default: 'ALL_KEYS',
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Prompt',
        default: null,
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
      },
      render_on_canvas: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Render on canvas',
        default: true,
      },
    },
  };
  class ImageKeyboardResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      var height, width;
      var response = {
        rt: null,
        key: null,
      };
      if (trial.render_on_canvas) {
        display_element.innerHTML = '';
        var image = new Image();
        image.onload = () => {
          height = image.naturalHeight;
          width = image.naturalWidth;
          display_element.innerHTML =
            '<canvas id="jspsych-image-keyboard-response-canvas"></canvas>';
          var canvas = display_element.querySelector(
            '#jspsych-image-keyboard-response-canvas'
          );
          canvas.width = width;
          canvas.height = height;
          canvas.style.maxHeight = '500px';
          var ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);
          if (trial.prompt !== null) {
            display_element.innerHTML += trial.prompt;
          }
          if (trial.choices != 'NO_KEYS') {
            this.jsPsych.pluginAPI.get ={
              callback_function: after_response,
              valid_responses: trial.choices,
              rt_method: 'performance',
              persist: false,
              allow_held_key: false,
            });
          }
          if (trial.stimulus_duration !== null) {
            this.jsPsych.pluginAPI.setTimeout(() => {
              canvas.style.visibility = 'hidden';
            }, trial.stimulus_duration);
          }
          if (trial.trial_duration !== null) {
            this.jsPsych.pluginAPI.setTimeout(() => {
              end_trial();
            }, trial.trial_duration);
          }
        };
        image.src = trial.stimulus;
      } else {
        var html = '<img src="' + trial.stimulus + '" id="jspsych-image-keyboard-response-stimulus">';
        if (trial.prompt !== null) {
          html += trial.prompt;
        }
        display_element.innerHTML = html;
        var start_time = performance.now();
        if (trial.choices != 'NO_KEYS') {
          this.jsPsych.pluginAPI.get ={
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false,
          });
        }
        if (trial.stimulus_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
          }, trial.stimulus_duration);
        }
        if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            end_trial();
          }, trial.trial_duration);
        }
      }
      const after_response = (info) => {
        if (trial.render_on_canvas) {
          display_element.querySelector('#jspsych-image-keyboard-response-canvas').className += ' responded';
        } else {
          display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';
        }
        if (response.key == null) {
          response = info;
        }
        if (trial.response_ends_trial) {
          end_trial();
        }
      };
      const end_trial = () => {
        this.jsPsych.pluginAPI.clearAllTimeouts();
        this.jsPsych.pluginAPI.killKeyboardListeners();
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.key,
        };
        display_element.innerHTML = '';
        this.jsPsych.finishTrial(trial_data);
      };
    }
    simulate(trial, simulation_mode, simulation_options, load_callback) {
      if (trial.response_ends_trial) {
        throw new Error('Simulation not implemented for response_ends_trial = true.');
      }
      if (trial.choices == 'NO_KEYS') {
        load_callback();
        this.jsPsych.pluginAPI.setTimeout(function () {
          this.jsPsych.finishTrial({
            rt: null,
            response: null,
            stimulus: trial.stimulus,
          });
        }, trial.trial_duration);
      } else {
        load_callback();
        this.jsPsych.pluginAPI.setTimeout(function () {
          var rt = this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true);
          var response = this.jsPsych.pluginAPI.Keys.G;
          this.jsPsych.finishTrial({
            rt: rt,
            response: response,
            stimulus: trial.stimulus,
          });
        }, rt);
      }
    }
  }
  ImageKeyboardResponsePlugin.info = info;
  return ImageKeyboardResponsePlugin;
})(jsPsych);
