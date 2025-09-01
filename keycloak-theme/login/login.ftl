<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        <div id="kc-header-wrapper">
        </div>
    <#elseif section = "form">
    <div id="kc-form">
      <div id="kc-form-wrapper">
        <div class="logo-container">
            <img class="mx-image mx-name-image3 logo-red img-responsive" src="https://mspsit3.cpaxtra.co.th/img/LandingPage$Images$app_icon_main.png?638919039079939606" role="presentation">
        </div>
        <h2 class="login-title">Sign in to your account</h2>
        <#if realm.password>
            <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                <div class="form-group">
                    <label for="username" class="form-label">
                        ${msg("username")}
                    </label>
                    <#if usernameHidden??>
                        <input tabindex="1" id="username" class="form-control" name="username" value="${(login.username!'')}"
                               type="hidden" disabled="disabled" autocomplete="off" readonly
                               aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                        />
                    <#else>
                        <input tabindex="1" id="username" class="form-control" name="username" value="${(login.username!'')}"
                               type="text" autofocus autocomplete="off"
                               aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                        />
                    </#if>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">${msg("password")}</label>
                    <input tabindex="2" id="password" class="form-control" name="password" type="password" autocomplete="off"
                           aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                    />
                    <#if messagesPerField.existsError('username','password')>
                        <span id="input-error" class="input-error error-message" aria-live="polite">
                            ${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}
                        </span>
                    </#if>
                </div>

                <div class="form-group">
                    <div class="forgot-password-link">
                        <a href="http://localhost:5173" class="link-forgot-password">${msg("doForgotPassword")}</a>
                    </div>
                </div>

                <div class="form-group login-pf-settings">
                    <div id="kc-form-options">
                        <#if realm.rememberMe && !usernameHidden??>
                            <div class="checkbox">
                                <label>
                                    <#if login.rememberMe??>
                                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked> ${msg("rememberMe")}
                                    <#else>
                                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox"> ${msg("rememberMe")}
                                    </#if>
                                </label>
                            </div>
                        </#if>
                    </div>
                    <div class="form-actions">
                        <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                        <input tabindex="4" class="btn btn-primary btn-block btn-lg" name="login" id="kc-login" type="submit" value="${msg("doLogIn")}"/>
                    </div>
                </div>
            </form>
        </#if>
        </div>
    </div>
    <#elseif section = "info" >
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <div id="kc-registration">
                <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
            </div>
        </#if>
        <#if realm.password && social.providers??>
            <div id="kc-social-providers" class="social-providers">
                <ul>
                    <#list social.providers as p>
                        <li><a href="${p.loginUrl}" id="zocial-${p.alias}" class="zocial ${p.providerId}"> <span>${p.displayName}</span></a></li>
                    </#list>
                </ul>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>