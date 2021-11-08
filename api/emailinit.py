from flask_mail import Mail


def initEmail(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_USERNAME'] = 'etfagriculture@gmail.com'
    app.config['MAIL_PASSWORD'] = 'agriculture2021'

    return Mail(app)
