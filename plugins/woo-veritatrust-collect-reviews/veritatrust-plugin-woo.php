<?php
/*
Plugin Name: Veritas get review plugin
Description: Cet extension a comme objectif de récuperer des données issues de la commande dans le site merchants et de les
    envoyer à veritatrust
Author: Fatahou Ahamadi
*/
header("Access-Control-Allow-Origin: *");

/**
 * CREATION D UNE FONCTION get_data_for_commands() qui va envoyer une requete chez veritatrust server
 * ADD update by Fatahou
 * 22 Aout 2022
 * 
 * 
 *  
 * */
 
 
 add_action( 'woocommerce_order_status_changed', 'wooc_veritatrust_send_request');
 
 // Enregistrement de l'action lors de l'activation du plugin
 register_activation_hook( __FILE__, 'veritatrust_activation' );
 // Enregistrement de l'action lors de la désactivation du plugin
 register_deactivation_hook( __FILE__, 'veritatrust_desactivation' );
 
 function wooc_veritatrust_get_data($order_id) {
     
	$order = new WC_Order($order_id);
	$data = null;
	if(!is_null($order->get_id())) {
		$data = array();
		$data['order_date'] = date('Y-m-d H:i:s', strtotime($order->get_date_created()));
		if (!empty($order->get_billing_email()) && !preg_match('/\d$/', $order->get_billing_email())) {
		    $data['email'] = $order->get_billing_email(); 
		    
		} 
		else 
		{ 
		    return; 
		}
		if (!empty($order->get_billing_first_name())) { 
		// $data['customer_name'] = $order->get_billing_first_name().' '.$order->get_billing_last_name(); 
		 
		 $data['firstname'] = $order->get_billing_first_name();
		 $data['lastname'] = $order->get_billing_last_name();
		    
		} 
		else 
		{ 
		    return; 
		    
		}
		$data['orderId'] = strval($order_id);
		$data['source'] = "Woocommerce";

		$products_arr = array();

		if(empty($order->get_items())) 
		{ 
		return; }
		$i = 0;
		foreach ($order->get_items() as $product) {
			if ($product['product_id'] == "0") { 
			return; }
            $_product = wc_get_product($product['product_id']);
            if(is_object($_product)){
                
                $product_data = array();   
                $product_data['url'] = get_permalink($product['product_id']); 
                $product_data['name'] = $product['name'];
                $product_data['productId'] = $product['product_id'];
                $product_data['image'] = wc_veritatrust_get_product_image_url($product['product_id']);
             //   $product_data['description'] = wp_strip_all_tags($_product->get_description());
             //   $product_data['price'] = $_product->get_price();
                
             //   $data['image'] = $product_data['image'];
             //   $data['name'] = $product_data['name'];
            
                $website_var =  get_site_url($product['product_id']);
                $data['website'] = str_replace('https://', 'www.', $website_var);

              //  $data['productId'] =  strval($product['product_id']);
                
                $specs_data = array();
                if($_product->get_sku()){ $specs_data['external_sku'] =$_product->get_sku();    } 
                if($_product->get_attribute('upc')){ $specs_data['upc'] =$_product->get_attribute('upc');} 
                if($_product->get_attribute('isbn')){ $specs_data['isbn'] = $_product->get_attribute('isbn');} 
                if($_product->get_attribute('brand')){ $specs_data['brand'] = $_product->get_attribute('brand');  } 
                if($_product->get_attribute('mpn')){ $specs_data['mpn'] =$_product->get_attribute('mpn'); } 
                if($_product->get_attribute('gtin')){ $specs_data['gtin'] =$_product->get_attribute('gtin'); } 
                $ean = get_post_meta( $_product->get_id(), 'ean', true );
                $specs_data['gtin'.$length] = (string)$ean;
                
                if(!empty($specs_data)){ $product_data['specs'] = $specs_data;  }
               
            } else { 
            return; }
			$products_arr[$i] = $product_data;	$i = $i + 1;
		}	
		$data['products'] = $products_arr;
	}
	return $data;
     
 }


/**
 * CREATION D UNE FONCTION send_request_veritatrust() qui va envoyer une requete chez veritatrust server
 * ADD update by Fatahou
 * 22 Aout 2022
 * 
 * 
 *  
 * */
 
 
function wooc_veritatrust_send_request($order_id) {
    
    
    $order = wc_get_order($order_id);
    $orderStatus = 'wc-' . $order->get_status();
    
    $purchase_data = wooc_veritatrust_get_data($order_id);
    
    $ch = curl_init();
	try {
		curl_setopt($ch, CURLOPT_URL, "https://api.veritatrust.com/api/order/confirmed");
		curl_setopt($ch, CURLOPT_POST, true);
		$payload = json_encode($purchase_data);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
		
		$response = curl_exec($ch);
		
	    if (curl_errno($ch)) {
			echo curl_error($ch);
			die();
		}
		
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		if($http_code == intval(200)){
			echo $response;
		}
		else{
			echo "Ressource introuvable : " . $http_code;
		}
	} catch (\Throwable $th) {
		throw $th;
	} finally {
		curl_close($ch);
	}

} 
/***
 * Fonction qui permet de récupérer l url de l image du produit
 * 
 *  */

function wc_veritatrust_get_product_image_url($product_id) {
	$url = wp_get_attachment_url(get_post_thumbnail_id($product_id));
	return $url ? $url : null;
	
}

function veritatrust_activation() {
    // Initialisation de cURL
    $ch = curl_init();

    // Configuration de la requête cURL 
    curl_setopt($ch, CURLOPT_URL, 'https://api.veritatrust.com/api/merchant_profiles/update-status/www.shop.veritatrust.com');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('CollectingReviews' => '1')));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

    // Exécution de la requête cURL
    $response = curl_exec($ch);

    // Vérifier si la requête a réussi
    if ($response === false) {
        $error_message = curl_error($ch);
        // Traitement de l'erreur
    } else {
        // Traitement de la réponse
    }

    // Fermeture de la session cURL
    curl_close($ch);
}


// Fonction à exécuter lors de la désactivation du plugin
function veritatrust_desactivation() {
 $ch = curl_init();

    // Configuration de la requête cURL https://api.veritatrust.com/api/merchant_profiles/update-status/www.shop.veritatrust.com
    curl_setopt($ch, CURLOPT_URL, 'https://api.veritatrust.com/api/merchant_profiles/update-status/www.shop.veritatrust.com');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('CollectingReviews' => '0')));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

    // Exécution de la requête cURL
    $response = curl_exec($ch);

    // Vérifier si la requête a réussi
    if ($response === false) {
        $error_message = curl_error($ch);
        // Traitement de l'erreur
    } else {
        // Traitement de la réponse
    }

    // Fermeture de la session cURL
    curl_close($ch);
}