<?php

class AdminVtGetCollectReviewsController extends ModuleAdminController
{
    public function __construct()
    {
        $this->bootstrap = true;
        $this->table = 'configuration'; // Table utilisée pour stocker le token API
        $this->className = 'Configuration'; // Classe utilisée pour effectuer les opérations CRUD sur la table
        $this->lang = false;
        $this->addRowAction('edit');
        $this->explicitSelect = true;

        parent::__construct();
    }

 /*  public function renderForm()
        {
            // Récupérer le token API actuellement enregistré
            $apiToken = Configuration::get('VT_API_TOKEN');
        
            $fieldsForm[0]['form'] = array(
                'legend' => array(
                    'title' => $this->l('Configure API Token'),
                ),
                'input' => array(
                    array(
                        'type' => 'text',
                        'label' => $this->l('API Token'),
                        'name' => 'VT_API_TOKEN',
                        'required' => true,
                        'desc' => $this->l('Enter your VeritaTrust API Token.'),
                    ),
                ),
                'submit' => array(
                    'title' => $this->l('Save'),
                ),
            );
        
            $helper = new HelperForm();
            $helper->show_toolbar = false;
            $helper->table = $this->table;
            $lang = new Language((int)Configuration::get('PS_LANG_DEFAULT'));
            $helper->default_form_language = $lang->id;
            $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG') ? Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG') : 0;
            $helper->identifier = $this->identifier;
            $helper->submit_action = 'save_token';
            $helper->token = $this->token;
            $helper->tpl_vars = array(
                'fields_value' => array(
                    'VT_API_TOKEN' => $apiToken,
                ),
            );
        
            return $helper->generateForm($fieldsForm);
        }  */
        
        public function renderForm()
        {
            // Récupérer le token API actuellement enregistré
            $apiToken = Configuration::get('VT_API_TOKEN');
            
          
            $fieldsForm[0]['form'] = array(
                'legend' => array(
                    'title' => $this->l('Configure API Token'),
                ),
                'input' => array(
                    array(
                        'type' => 'text',
                        'label' => $this->l('API Token'),
                        'name' => 'VT_API_TOKEN',
                        'required' => true,
                        'desc' => $this->l('Enter your VeritaTrust API Token.'),
                    ),
                ),
                'submit' => array(
                    'title' => $this->l('Save'),
                ),
            );
        
           
        
            $helper = new HelperForm();
            $helper->show_toolbar = false;
            $helper->table = $this->table;
            $lang = new Language((int)Configuration::get('PS_LANG_DEFAULT'));
            $helper->default_form_language = $lang->id;
            $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG') ? Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG') : 0;
            $helper->identifier = $this->identifier;
            $helper->submit_action = 'save_token';
            $helper->token = $this->token;
            $helper->tpl_vars = array(
                'fields_value' => array(
                    'VT_API_TOKEN' => $apiToken,
                ),
            );
        
            return $helper->generateForm($fieldsForm);
        }


        public function postProcess()
        {
            // Gérer la sauvegarde du token API
            if (Tools::isSubmit('save_token')) {
                $apiToken = Tools::getValue('VT_API_TOKEN');
                if (!empty($apiToken)) {
                    Configuration::updateValue('VT_API_TOKEN', $apiToken);
                    $this->context->smarty->assign('confirmation', $this->module->l('API Token updated successfully.'));
                } else {
                    $this->context->smarty->assign('error', $this->module->l('API Token cannot be empty.'));
                }
            }
        
            parent::postProcess();
        }
     public function getContent()
    {
        $output = $this->renderForm();
        return $output;
    }
}
