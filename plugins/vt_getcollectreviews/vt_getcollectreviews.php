<?php
if (!defined('_PS_VERSION_')) {
    exit;
}

class Vt_GetCollectReviews extends Module
{
  
  public function __construct()
        {
            $this->name = 'vt_getcollectreviews';
            $this->tab = 'front_office_features';
            $this->version = '1.0.0';
            $this->author = 'Veritatrust';
            $this->need_instance = 0;
            $this->ps_versions_compliancy = [
                'min' => '1.7',
                'max' => _PS_VERSION_
            ];
            $this->bootstrap = true;
 
            parent::__construct();
 
            $this->displayName = $this->l('Module Veritatrust');
            $this->description = $this->l('Module Veritatrust to collect reviews ');
 
            $this->confirmUninstall = $this->l('Êtes-vous sûr de vouloir désinstaller ce module ?');
 
            if (!Configuration::get('NS_MONMODULE_PAGENAME')) {
                $this->warning = $this->l('Aucun nom fourni');
            }
        }
        
    public function install()
    {
        return parent::install() && $this->registerHook('actionValidateOrder');
    }
    
    public function uninstall()
    {
        return parent::uninstall();
    }

    public function hookActionValidateOrder($params)
    {
        $order = $params['order'];

        $purchase_data = $this->getVeritaTrustData($order);

        // Send request to VeritaTrust API
        $response = $this->sendVeritaTrustRequest(json_encode($purchase_data));

        // Process the response if needed
        // ...

        // Log the response
        
    }
    
    private function getVeritaTrustData($order)
    {
        // Load the order object
        $order = new Order($order->id);
         
        // Get customer ID from the order
        $customer_id = $order->id_customer;
        
        // Load the customer object
        $customer = new Customer($customer_id);

        $data = array(
            'order_date' => date('Y-m-d H:i:s', strtotime($order->date_add)),
            'email' => $customer->email,
            'firstname' => $customer->firstname,
            'lastname' => $customer->lastname,
            'orderId' => $order->id,
            'source' => "Prestashop",
            'website' => "www.presta.veritatrust.com" , // Replace with the actual website URL
            'products' => $this->getProductInfo($order->getProducts())
        );
        
                // Log the response
        $logMessage = "actionValidateOrder hook triggered: " . print_r($this->getProductInfo($order->getProducts()), true);
        file_put_contents(_PS_MODULE_DIR_ . 'vt_getcollectreviews/logs/products_infos.log', $logMessage . "\n", FILE_APPEND);

        return $data;
    }

    private function getProductInfo($products)
    {
        $productInfo = array();


        foreach ($products as $product) {
            
            
    $productInfo[] = array(
        'url' => $product['url'],
        'name' => $product['name'],
        'productId' => $product['id_product'], // Utilisez 'id_product' au lieu de 'productId'
        'image' => $product['cover']['bySize']['home_default']['url'], // Accédez à l'URL de l'image du produit
    );
}

        return $productInfo;
    }

    private function sendVeritaTrustRequest($data)
    {
        // Dans votre méthode sendVeritaTrustRequest
        // Récupérer le token API enregistré
        $apiToken = Configuration::get('VT_API_TOKEN');
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "https://api.veritatrust.com/api/order/confirmed");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
      // Ajoutez le token dans les en-têtes de la requête
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type:application/json',
            'Authorization: Bearer ' . $apiToken // Ajoutez le token dans l'en-tête Authorization
        ));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            echo curl_error($ch);
            die();
        }

        curl_close($ch);

        return $response;
    }
     

    public function getContent()
    {
        include_once($this->getLocalPath().'controllers/admin/AdminVtGetCollectReviewsController.php');
        $adminVtGetCollectReviewsController = new AdminVtGetCollectReviewsController();
        return $adminVtGetCollectReviewsController->postProcess() . $adminVtGetCollectReviewsController->renderForm();
    
    }

  
}
