from flask import Flask, render_template
import json

app = Flask(__name__)

PATH_TRUFFLE_WK = '/Users/rauljordan/Desktop/Ethereum/Contracts/LoveChain'
truffleFile = json.load(open(PATH_TRUFFLE_WK + '/build/contracts/LoveShop.json'))

@app.route('/')
def gallery():
    return render_template('gallery.html', contract=truffleFile)

@app.route('/purchase/<int:item_id>')
def purchase(item_id):
    return render_template('purchase.html', contract=truffleFile, item=item_id)

@app.route('/about')
def about():
    return render_template('about.html', contract=truffleFile)

@app.route('/inventory')
def inventory():
    return render_template('inventory.html', contract=truffleFile)

@app.route('/create')
def create():
    return render_template('create.html', contract=truffleFile)

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    r.headers['Pragma'] = 'no-cache'
    r.headers['Expires'] = '0'
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r
