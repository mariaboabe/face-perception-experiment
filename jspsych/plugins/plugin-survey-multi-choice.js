/* eslint-disable */
var jspsychSurveyMultiChoice = (function (jspsych) {
  'use strict';
  const info = {
    name: 'survey-multi-choice',
    parameters: {
      questions: {
        type: jspsych.ParameterType.COMPLEX,
        pretty_name: 'Questions',
        default: undefined,
        array: true,
        nested: {
          prompt: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: 'Prompt',
            default: undefined,
          },
          options: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'Options',
            default: undefined,
            array: true,
          },
          required: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'Required',
            default: false,
          },
          horizontal: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'Horizontal',
            default: false,
          },
          name: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
          },
        },
      },
      randomize_question_order: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
      },
      preamble: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Preamble',
        default: null,
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
      },
      autocomplete: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Allow autocomplete',
        default: false,
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
      },
    },
  };
  class SurveyMultiChoicePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      var plugin_id_name = 'jspsych-survey-multi-choice';
      var plugin_id_selector = '#' + plugin_id_name;
      var _html = '';
      _html += '<style id="jspsych-survey-multi-choice-css">';
      _html +=
        plugin_id_selector +
        ' .jspsych-survey-multi-choice-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }' +
        plugin_id_selector +
        ' .jspsych-survey-multi-choice-option { padding: 4px 0px; }' +
        plugin_id_selector +
        ' .jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option { display: inline-block; margin-left: 10px; padding-right: 10px; }' +
        plugin_id_selector +
        ' .jspsych-survey-multi-choice-option input[type="radio"] {margin-right: 4px;}' +
        '</style>';
      if (trial.preamble !== null) {
        _html +=
          '<div id="jspsych-survey-multi-choice-preamble" class="jspsych-survey-multi-choice-preamble">' +
          trial.preamble +
          '</div>';
      }
      var trial_form_id = 'jspsych-survey-multi-choice-form';
      _html +=
        '<form id="' +
        trial_form_id +
        '" autocomplete="' +
        trial.autocomplete +
        '">';
      var question_order = [];
      for (var i = 0; i < trial.questions.length; i++) {
        question_order.push(i);
      }
      if (trial.randomize_question_order) {
        question_order = this.jsPsych.randomization.shuffle(question_order);
      }
      for (var i = 0; i < trial.questions.length; i++) {
        var question = trial.questions[question_order[i]];
        var question_index = question_order[i];
        var required_attr = question.required ? 'required' : '';
        var horizontal_attr = question.horizontal ? 'jspsych-survey-multi-choice-horizontal' : '';
        var question_classes = ['jspsych-survey-multi-choice-question', horizontal_attr];
        _html +=
          '<div id="jspsych-survey-multi-choice-' +
          question_index +
          '" class="' +
          question_classes.join(' ') +
          '"  data-name="' +
          question.name +
          '">';
        _html += '<p class="jspsych-survey-multi-choice-prompt">' + question.prompt + '</p>';
        for (var j = 0; j < question.options.length; j++) {
          var option_id = 'jspsych-survey-multi-choice-option-' + question_index + '-' + j;
          var input_name = question.name
            ? question.name
            : 'jspsych-survey-multi-choice-response-' + question_index;
          var input_id = 'jspsych-survey-multi-choice-response-' + question_index + '-' + j;
          var option_label = '<label class="jspsych-survey-multi-choice-text" for="' + input_id + '">' + question.options[j] + '</label>';
          var option_input =
            '<input type="radio" id="' +
            input_id +
            '" name="' +
            input_name +
            '" value="' +
            question.options[j] +
            '" ' +
            required_attr +
            '></input>';
          _html += '<div class="jspsych-survey-multi-choice-option">';
          _html += option_input;
          _html += option_label;
          _html += '</div>';
        }
        _html += '</div>';
      }
      _html +=
        '<input type="submit" id="' +
        plugin_id_name +
        '-next" class="jspsych-btn jspsych-survey-multi-choice" value="' +
        trial.button_label +
        '"></input>';
      _html += '</form>';
      display_element.innerHTML = _html;
      var start_time = performance.now();
      display_element
        .querySelector('#' + trial_form_id)
        .addEventListener('submit', (e) => {
        e.preventDefault();
        var end_time = performance.now();
        var rt = Math.round(end_time - start_time);
        var question_data = {};
        for (var i = 0; i < trial.questions.length; i++) {
          var match = display_element.querySelector(
            '#' + plugin_id_name + '-' + i + ' input[type=radio]:checked'
          );
          if (match) {
            var val = match.value;
          } else {
            var val = '';
          }
          var name = trial.questions[i].name ? trial.questions[i].name : 'Q' + i;
          if (name == '') {
            name = 'Q' + i;
          }
          question_data[name] = val;
        }
        var trial_data = {
          rt: rt,
          response: question_data,
        };
        display_element.innerHTML = '';
        this.jsPsych.finishTrial(trial_data);
      });
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      }
      const end_trial = () => {
        this.jsPsych.pluginAPI.clearAllTimeouts();
        var trial_data = {
          rt: null,
          response: {},
        };
        display_element.innerHTML = '';
        this.jsPsych.finishTrial(trial_data);
      };
    }
  }
  SurveyMultiChoicePlugin.info = info;
  return SurveyMultiChoicePlugin;
})(jsPsych);
