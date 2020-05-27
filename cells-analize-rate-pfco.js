import { LitElement, html, } from 'lit-element';
import { getComponentSharedStyles, } from '@cells-components/cells-lit-helpers/cells-lit-helpers.js';
import styles from './cells-analize-rate-pfco-styles.js';
import '@quotation-components/cells-theme-pfco';
import '@quotation-components/cells-base-behavior-pfco';
import '@bbva-web-components/bbva-button-default';
import '@bbva-web-components/bbva-button-icon';
import '@bbva-web-components/bbva-form-field/bbva-form-field.js';
import '@bbva-web-components/bbva-form-textarea/bbva-form-textarea.js';
import '@quotation-components/cells-panel-pfco';

/**
This component ...

Example:

```html
<cells-analize-rate-pfco></cells-analize-rate-pfco>
```

##styling-doc

@customElement cells-analize-rate-pfco
@polymer
@LitElement
@demo demo/index.html
*/
const baseBehavior = CellsBehaviors.cellsBaseBehaviorPfco;
export class CellsAnalizeRatePfco extends baseBehavior(LitElement) {
  static get is() {
    return 'cells-analize-rate-pfco';
  }

  // Declare properties
  static get properties() {
    return {
      data: {type: Array},
      bodyRequestAnalyzeRate: { type: Object },
      pathCreate: {type: String},
      keyProductResponse: {type: String},
      hostQuotation: {type: String}
    };
  }

  // Initialize properties
  constructor() {
    super();
    this.data = [];
    this.eventLoadCustomer = 'change-customer-data';
    this.addEventListener('load-data',(e)=>{
      this.setData(e.detail);
    });
    this.initializeBodyRequestAnalyzeRate();
  }

  initializeBodyRequestAnalyzeRate() {
    this.bodyRequestAnalyzeRate = {};
    this.bodyRequestAnalyzeRate.interestRates = {};
    this.bodyRequestAnalyzeRate.interestRates.effectiveRates = [
      {
        id: "REQUESTED_TEA",
        percentage: 0.0
      }
    ];
    this.bodyRequestAnalyzeRate.rate = {
      id: ""
    };
    this.bodyRequestAnalyzeRate.fees = [{
      feeType: {},
      detail: {}
    }];
  }

  setData(data){
    this.data = data;
    this.requestUpdate();
  }

  static get shadyStyles() {
    return `
      ${styles.cssText}
      ${getComponentSharedStyles('cells-analize-rate-pfco-shared-styles').cssText}
      ${getComponentSharedStyles('cells-theme-pfco').cssText}
    `;
  }

  createAnalyzeRate(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13 || e.type == "focusout") {
        if(e.target.value) {
          this.bodyRequestAnalyzeRate.interestRates.effectiveRates[0].percentage = parseFloat(e.target.value)/100;
          this.bodyRequestAnalyzeRate.rate.id = this.data.quotations[0].rate.id;
          this.shadowRoot.querySelector('#teaAprobada').value=parseFloat(e.target.value).toFixed(2);
          this.dispatch(this.eventCreateAnalyzeRate || 'create-analyze-rate', this.bodyRequestAnalyzeRate);
          if(!this.isEmpty(this.pathCreate)) {
              let settings = {
                name: 'create-analyze-rate',
                host: this.hostQuotation,
                path: this.pathCreate,
                method: 'POST',
                body: JSON.stringify(this.bodyRequestAnalyzeRate),
                onSuccess: (result) => {
                    let response = this.extract(result, this.keyProductResponse, {});
                    this.setearDataCreate(response);
                },
                onError: (error)=>{ console.error('Error en la simulacion de tasa', error); }
              }
              this.dispatch(this.eventInvokeRequest, settings);
           }
       }
    }
  }

  setearDataCreate(response){
    let rorcArray = response.fees;
    let spreadArray = response.liquidityIndicators;
    let teaApprove = this.shadowRoot.querySelector('#teaAprobada').value;
    let diApprove = this.shadowRoot.querySelector('#text-di-approved').innerHTML.trim();

    rorcArray.forEach((item,index)=>{
      if(item.feeType.id=='RORC_CLIENT'){
        this.shadowRoot.querySelector('#text-rorc-client').innerHTML=parseFloat(item.detail.percentage*100).toFixed(2);
      }else if(item.feeType.id=='RORC_UPDATED'){
        this.shadowRoot.querySelector('#text-rorc-updated').innerHTML=parseFloat(item.detail.percentage*100).toFixed(2);
      }else if(item.feeType.id=='RORC_APPROVED'){
        this.shadowRoot.querySelector('#text-rorc-approved').innerHTML=parseFloat(item.detail.percentage*100).toFixed(2);
      }
    });

    spreadArray.forEach((item,index)=>{
      if(item.id=='BENEFIT_BEFORE_TAX'){
        let valorBAIApproved = parseFloat(item.detail.percentage*100).toFixed(2);
        this.shadowRoot.querySelector('#text-bai-approved').innerHTML=valorBAIApproved;
        if(valorBAIApproved<0){
          this.shadowRoot.querySelector('#text-bai-approved').classList.add("text-red");
          this.shadowRoot.querySelector('#text-bai-approved').classList.remove("text-blue");
        }else{
          this.shadowRoot.querySelector('#text-bai-approved').classList.add("text-blue");
          this.shadowRoot.querySelector('#text-bai-approved').classList.remove("text-red");
        }           
      }else if(item.id=='SPREAD_OF_OPERATION'){
        this.shadowRoot.querySelector('#text-spread-approved').innerHTML=parseFloat(item.detail.percentage*100).toFixed(2);
      }
    });
  }

  setearEffectiveRatesData(effectiveRatesArray, id) {
    let valor = "";
    effectiveRatesArray.forEach((item,index)=>{
      if(item.id==id){
        valor=parseFloat(item.percentage*100).toFixed(2);
      }
    });
    return valor;
  }

  setearFeesData(feesArray, feeType) {
    let valor = "";
    feesArray.forEach((item,index)=>{
      if(item.feeType.id==feeType){
        valor=parseFloat(item.detail.percentage*100).toFixed(2);
      }
    });
    return valor;
  }

  setearProfitabilitysData(profitabilityArray, id) {
    let valor = "";
    profitabilityArray.forEach((item,index)=>{
      if(item.id==id){
        valor=parseFloat(item.percentage*100).toFixed(2);
      }
    });
    return valor;
  }

  setearliquidityData(liquidityArray, id) {
    let valor = "";
    liquidityArray.forEach((item,index)=>{
      if(item.id==id){
        valor=parseFloat(item.detail.percentage*100).toFixed(2);
      }
    });
    return valor;
  }

  // Define a template
  render() {
    return html`
      <style>${this.constructor.shadyStyles}</style>
      <slot></slot>
      <div class="panel-container-body">
        <div class='section group'>
          <div class="col span_4_of_12">
            <!-- TEA Modelo -->
            <cells-panel-pfco title="TEA Modelo"  headerBg = "#f4f4f4" titleColor = "#666666">
              <div class="panel-container-body">
                <div class='section group'>
                  <div class="col span_12_of_12"> 
                    <div class="box-item-info">
                      <div class="label">
                        TEA (%)
                      </div>
                      <div class="text-info">
                        <div class="text-black" id="text-tea-model">
                          ${this.setearEffectiveRatesData(this.data.quotations[0].interestRates.effectiveRates,"TEA_OF_MODEL")}
                        </div>
                      </div>
                    </div>                                   
                  </div>
                </div>
                <div class='section group'> 
                  <div class="col span_12_of_12"> 
                    <div class="box-item-info">
                      <div class="label">
                        BAI (%)
                      </div>
                      <div class="text-info" id="text-bai-model">
                        ${this.setearProfitabilitysData(this.data.quotations[0].profitabilityIndicators, "BENEFIT_BEFORE_TAX_OF_OPERATION")}
                      </div>
                    </div>
                  </div>
                </div>
                <div class='section group'>
                  <div class="col span_12_of_12">
                    <div class="box-item-info">
                      <div class="label">
                        RORC (%)
                      </div>
                      <div class="text-info" id="text-rorc-model">--</div>
                    </div>
                  </div>
                </div>       
              </div>
            </cells-panel-pfco>

            <!-- TEA Solicitada -->
            <cells-panel-pfco title="TEA Solicitada"  headerBg = "#f4f4f4" titleColor = "#666666" style="margin-top:20px">
              <div class="panel-container-body">
                <div class='section group'>
                  <div class="col span_12_of_12"> 
                    <div class="box-item-info">
                      <div class="label">
                        TEA (%)
                      </div>
                      <div class="text-info">
                        <div class="text-black" id="text-tea-requested">
                          ${this.setearEffectiveRatesData(this.data.quotations[0].interestRates.effectiveRates,"REQUESTED_TEA")}
                        </div>
                      </div>
                    </div>                                   
                  </div>
                </div>
                <div class='section group'> 
                  <div class="col span_12_of_12"> 
                    <div class="box-item-info">
                      <div class="label">
                        BAI (%)
                      </div>
                      <div class="text-info" id="text-bai-requested">
                        ${this.setearProfitabilitysData(this.data.quotations[0].profitabilityIndicators, "BENEFIT_BEFORE_TAX_OF_REQUESTED_TEA")}
                      </div>
                    </div>
                  </div>
                </div>
                <div class='section group'>
                  <div class="col span_12_of_12">
                    <div class="box-item-info">
                      <div class="label">
                        RORC (%)
                      </div>
                      <div class="text-info" id="text-rorc-operation">--</div>
                    </div>
                  </div>
                </div>       
              </div>
            </cells-panel-pfco> 
          </div>

          <!-- TEA APROBADA -->
          <div class="col span_6_of_12">
            <cells-panel-pfco title="TEA Aprobada" headerBg = "#f4f4f4" titleColor = "#1973B8">
              <div class="panel-container-body ajustarBottom">
                <div class='section group'>
                  <div class="col span_6_of_12">
                    <bbva-form-field 
                      max-length='10' 
                      id='teaAprobada' 
                      type='number' 
                      label='TEA (%)' 
                      error-message='No se ha informado el TEA'
                      required
                      @keypress="${this.createAnalyzeRate}"
                      @focusout="${this.createAnalyzeRate}"
                      value="${this.setearEffectiveRatesData(this.data.quotations[0].interestRates.effectiveRates,"REQUESTED_TEA")}">
                    </bbva-form-field>
                  </div>
                </div>
                <div class='section group'>
                  <div class="col span_6_of_12">
                    <div class="box-item-info">
                      <div class="label">DI (%)</div>
                      <div class="text-info" id="text-di-approved">
                        ${this.setearFeesData(this.data.quotations[0].fees, "FUNDING_COST_ADJUSTED")}
                      </div>
                    </div> 
                  </div>
                </div>
                <hr>
                <div class='section group'>
                  <div class="col span_6_of_12"> 
                    <div class="box-item-info">
                      <div class="label" style="font-weight:bold">SPREAD (%)</div>
                      <div class="text-info">
                        <div class="text-blue" id="text-spread-approved">
                          ${this.setearliquidityData(this.data.quotations[0].liquidityIndicators,"SPREAD_OF_REQUESTED_TEA")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col span_6_of_12"> 
                    <div class="box-item-info">
                      <div class="label" style="font-weight:bold">TEA Mínima (%)</div>
                      <div class="text-info">
                        <div class="text-blue" id="text-tea-approved-minimun">
                          ${this.setearEffectiveRatesData(this.data.quotations[0].interestRates.effectiveRates,"TEA_OF_AUTONOMY")}
                        </div>
                      </div>
                    </div>                   
                  </div>
                </div>
                <div class='section group'>
                  <div class="col span_6_of_12"> 
                  <div class="box-item-info">
                      <div class="label">CR (%)</div>
                      <div class="text-info" id="text-cr-approved">
                        ${this.setearFeesData(this.data.quotations[0].fees, "FINANCING_COST_STOCKHOLDER")}
                        <!-- ${this.setearFeesData(this.data.quotations[0].fees, "REGULATORY_CAPITAL")} -->
                      </div>
                    </div>                   
                  </div>
                  <div class="col span_6_of_12"> 
                  <div class="box-item-info">
                      <div class="label">BAI Mínimo (%)</div>
                      <div class="text-info" id="text-bai-minimun">
                        ${this.setearProfitabilitysData(this.data.quotations[0].profitabilityIndicators, "BAI_TEA_MINIMUM")}
                      </div>
                    </div>                     
                  </div>
                </div>
                <div class='section group'>
                  <div class="col span_6_of_12"> 
                  <div class="box-item-info">
                      <div class="label">PE (%)</div>
                      <div class="text-info" id="text-pe-approved">${this.setearFeesData(this.data.quotations[0].fees, "EXPECTED_LOSS")}</div>
                    </div>                     
                  </div>
                </div>
                <div class='section group'>
                  <div class="col span_6_of_12"> 
                    <div class="box-item-info">
                      <div class="label">CE (%)</div>
                      <div class="text-info" id="text-ce-approved">${this.setearFeesData(this.data.quotations[0].fees, "EFFICIENCY_COST")}</div>
                    </div>                     
                  </div>
                </div>
                <hr>
                <div class='section group'>
                  <div class="col span_6_of_12"> 
                    <div class="box-item-info">
                      <div class="label" style="font-weight:bold">BAI (%)</div>
                      <div class="text-info">
                        <div class="text-blue" id="text-bai-approved">
                          ${this.setearProfitabilitysData(this.data.quotations[0].profitabilityIndicators, "BENEFIT_BEFORE_TAX_OF_REQUESTED_TEA")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col span_6_of_12"> 
                    <div class="box-item-info">
                      <div class="label">RORC Aprobado (%)</div>
                      <div class="text-info" id="text-rorc-approved">--</div>
                    </div> 
                  </div>
                </div>
                <hr>
                <div class='section group'>
                  <div class="col span_6_of_12"> 
                    <div class="box-item-info">
                      <div class="label">RORC Cliente (%)</div>
                      <div class="text-info" id="text-rorc-client">--</div>
                    </div>
                  </div>
                  <div class="col span_6_of_12"> 
                    <div class="box-item-info">
                      <div class="label">RORC Actualizado (%)</div>
                      <div class="text-info" id="text-rorc-updated">--</div>
                    </div> 
                  </div>
                </div>
              </div>
            </cells-panel-pfco> 
          </div>
          <div class="col span_2_of_12">
            <div class='section group' style="margin-bottom:10px">
              <div class="col span_12_of_12">
                <button class="button info" @click=${this.enableSearch} style="width:100%">
                  <cells-icon icon="coronita:upload"></cells-icon> Elevar
                </button>
              </div>
            </div>
            <div class='section group' style="margin-bottom:10px">
              <div class="col span_12_of_12">
                <button class="button success" @click=${this.enableSearch} style="width:100%">
                  <cells-icon icon="coronita:correct"></cells-icon> Aprobar
                </button>
              </div>
            </div>
            <div class='section group'>
              <div class="col span_12_of_12">
                <button class="button yellow" @click=${this.enableSearch} style="width:100%">
                  <cells-icon icon="coronita:continue"></cells-icon> Devolver
                </button>
              </div>
            </div>
          </div>
        </div>       
      </div>

      <!-- Comentarios del Aprobador -->
      <div class="panel-container-body">
        <textarea @input = "${(e) => { this.validateMessage(e); }}" id = "text-comentario" placeholder = "Comentarios del Aprobador" ></textarea>
      </div>
    `;
  }
}

// Register the element with the browser
customElements.define(CellsAnalizeRatePfco.is, CellsAnalizeRatePfco);
