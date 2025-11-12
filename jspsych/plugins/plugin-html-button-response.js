/* eslint-disable */
var jspsychHtmlButtonResponse = (function (jspsych) {
  'use strict';
  const info = {
    name: 'html-button-response',
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
      },
      choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
      },
      button_html: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%c</button>',
        array: true,
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
      margin_vertical: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
      },
      margin_horizontal: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
      },
    },
  };
  class HtmlButtonResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      var html = '<div id="jspsych-html-button-response-stimulus">' + trial.stimulus + '</div>';
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        buttons = trial.button_html;
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      html += '<div id="jspsych-html-button-response-btngroup">';
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%c/g, trial.choices[i]);
        html +=
          '<div ' +
          'style="display: inline-block; margin:' +
          trial.margin_vertical +
          ' ' +
          trial.margin_horizontal +
          '" ' +
          'id="jspsych-html-button-response-button-' +
          i +
          '"' +
          'data-choice="' +
          i +
          '"' +
          'class="jspsych-html-button-response-button">' +
          str +
          '</div>';
      }
      html += '</div>';
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      display_element.innerHTML = html;
      for (var i = 0; i < trial.choices.length; i++) {
        display_element
          .querySelector('#jspsych-html-button-response-button-' + i)
          .addEventListener('click', () => {
          btn_response_click(i);
        });
      }
      var response = {
        rt: null,
        button: null,
      };
      const btn_response_click = (choice) => {
        var end_time = performance.now();
        var rt = Math.round(end_time - start_time);
        response.button = choice;
        response.rt = rt;
        display_element.querySelector(
          '#jspsych-html-button-response-stimulus'
        ).className += ' responded';
        var btns = display_element.querySelectorAll('.jspsych-html-button-response-button');
        for (var i = 0; i < btns.length; i++) {
          btns[i].setAttribute('disabled', 'disabled');
        }
        if (trial.response_ends_trial) {
          end_trial();
        }
      };
      var start_time = performance.now();
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(function () {
          display_element.querySelector(
            '#jspsych-html-button-response-stimulus'
          ).style.visibility = 'hidden';
        }, trial.stimulus_duration);
      }
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(function () {
          end_trial();
        }, trial.trial_duration);
      }
      const end_trial = () => {
        this.jsPsych.pluginAPI.clearAllTimeouts();
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.button,
        };
        display_element.innerHTML = '';
        this.jsPsych.finishTrial(trial_data);
      };
    }
  }
  HtmlButtonResponsePlugin.info = info;
  return HtmlButtonResponsePlugin;
})(jsPsych);
