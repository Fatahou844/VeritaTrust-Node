<div class="panel">
    {if isset($confirmation)}
        <div class="alert alert-success">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <strong>{$confirmation}</strong>
        </div>
    {/if}
    {if isset($error)}
        <div class="alert alert-danger">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <strong>{$error}</strong>
        </div>
    {/if}
    <form action="{$link->getAdminLink('AdminVtGetCollectReviewsController')|escape:'html':'UTF-8'}" method="post" class="defaultForm form-horizontal">
        <fieldset>
            <legend>{$fields_form[0]['form']['legend']['title']}</legend>
            {foreach from=$fields_form[0]['form']['input'] item="input"}
                <div class="form-group">
                    <label class="control-label col-lg-3">{$input.label}</label>
                    <div class="col-lg-9">
                        <input type="text" name="{$input.name}" value="{$input.value|escape:'html':'UTF-8'}" {if isset($input.size)}size="{$input.size}"{/if} {if isset($input.required) && $input.required}required="required"{/if} class="form-control" />
                        {if isset($input.desc)}
                            <p class="help-block">{$input.desc}</p>
                        {/if}
                    </div>
                </div>
            {/foreach}
            <div class="form-group">
                <div class="col-lg-offset-3 col-lg-9">
                    <button type="submit" name="save_token" class="btn btn-default pull-right">
                        <i class="process-icon-save"></i> {$fields_form.submit.title}
                    </button>
                </div>
            </div>
        </fieldset>
    </form>
</div>
