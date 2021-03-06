import { css, } from 'lit-element';


export default css`:host {
  display: block;
  box-sizing: border-box;
  --bbva-form-field-label-font-weight: bold;
  --bbva-form-field-label-line-height: 25px;
  --bbva-form-field-label-font-size: 1.1em;
  @apply --cells-analize-rate-pfco; }
  :host bbva-form-field {
    --_field-bg-color:  #e1effb;
    --_field-focused-label-color:#121212;
    --_field-focused-label-color:#121212; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *:before, *:after {
  box-sizing: inherit; }

.box-item-info {
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  padding: 5px 10px;
  border-bottom: 1px solid #666;
  background-color: #f4f4f4;
  margin-bottom: 2px; }
  .box-item-info .label {
    font-size: 0.9em;
    padding: 4px 0px 0px 0px;
    color: #121212;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 5px; }
  .box-item-info .text-info {
    font-size: 1.2em;
    width: 100%;
    padding: 0;
    color: #999;
    overflow: hidden;
    white-space: nowrap;
    transition: all 0.35s ease; }
  .box-item-info .text-info:hover {
    color: #000; }

.text-blue {
  color: #1973B8;
  font-weight: bold; }

.text-black {
  color: #121212;
  font-weight: bold; }

.text-red {
  color: #ff0000;
  font-weight: bold; }

.button.yellow {
  background-color: #F8CD51; }

.button.yellow:hover {
  background-color: #FADE8E; }

.ajustarBottom .span_6_of_12 {
  margin-bottom: 0.2%; }

textarea {
  width: 100%;
  background-color: #f4f4f4;
  border: none;
  border-bottom: 1px solid #666;
  min-height: 120px;
  font-family: var(--cells-fontDefault, sans-serif);
  font-size: 1em;
  padding: 10px 15px;
  outline: none;
  resize: none; }
`;