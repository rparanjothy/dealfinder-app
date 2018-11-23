# -*- coding: utf-8 -*-
"""
Created on Thu Aug 23 16:05:59 2018

@author: Ramkumar Paranjothy
"""

import pandas as pd
from flask import Flask,render_template,request,jsonify,Response
import os
# from flask_bootstrap import Bootstrap
from flask_cors import CORS

import json
import numpy as np
import nltk

def to_html(x):
    return x.to_html(index=False,escape=False,justify='left',classes=tablefmt,bold_rows=False)

def to_json(x):
    return json.loads(x.to_json(orient='records'))

def getURL(i):
    u='https://www.homedepot.com/p/{0}'.format(str(i))
    return u

def getBrandItems(x):
    u='/showSavings/bybrand/{1}/items'.format(str(x),x.replace(' ','%20'))
    return u


def getToken(x):
    u='<a href=/showSavings/1?search={0}>{0}</a>'.format(str(x),x.replace(' ','%20'))
    return u

app = Flask(__name__)
CORS(app)
# bootstrap=Bootstrap(app)


@app.route('/freqdist')
def freqdist():
    def sorter(x,sortFlag):
        if sortFlag=='true':    
            x=x.sort_values(by=[sortby],ascending=True)
        else:
            x=x.sort_values(by=[sortby],ascending=False)  
        print 'Done s'
        return x

    rank=request.args.get('rank',None)
    asc=request.args.get('asc','false')
    sortby=request.args.get('sortby','index')
    rnge=request.args.get('range',None)
    if rank:
        fd={k:v for k,v in prodnamefreqdist.most_common(int(rank))} # this is list so convert to dict
        fd=pd.DataFrame(data=fd.keys(),index=fd.values(),columns=['tokens']).reset_index()
        
        fd=sorter(fd,asc) 
    else:
        fd=prodnamefreqdist
        fd=pd.DataFrame(data=fd.keys(),index=fd.values(),columns=['tokens']).reset_index()
        #fd['tokens']=fd['tokens'].map(getToken)
        fd=sorter(fd,asc) 

    if rnge:
        #fd=prodnamefreqdist
        #fd=pd.DataFrame(data=fd.keys(),index=fd.values(),columns=['tokens']).reset_index()
        mn,mx=rnge.split('-')
        fd=fd.loc[fd['index'].between(int(mn),int(mx),inclusive=True)]

    return jsonify(to_json(fd))

@app.route('/showSavings/bybrand/<brandvalue>/items')
def showItems(brandvalue):
#    x=master.loc[master['brand'].str.decode('utf-8').str.contains(brandvalue),:]
    x=master.loc[master['brand'].str.decode('utf-8')==brandvalue,:]
    #x['itemid']=x['itemid']
    x['url']=x['itemid'].map(getURL)
    brandFilter=request.args.get('search',None)
    if brandFilter:
        x=x.loc[x['productname'].str.contains(brandFilter,regex=False,case=False),:]    
    return jsonify(to_json(x))

@app.route('/showSavings/showbybrand')
def showByBrand():
    sortby=request.args.get('sortby',None)
    brandFilter=request.args.get('search',None)
    
    if sortby and sortby not in ['counts','brand','minSavings','maxSavings','minPrice','maxPrice']:
        return 'SortBy param should be counts / brand / minSavings / maxSavings / minPrice / maxPrice'
    
    if sortby:
        byBrand_s=byBrand.sort_values(by=[sortby],kind='quicksort')
    else:
        byBrand_s=byBrand
    
    if brandFilter:
        byBrand_s=byBrand_s.loc[byBrand_s['brand'].str.contains(brandFilter,regex=False,case=False),:]    
    
    return jsonify(to_json(byBrand_s))

# @app.route('/customSearch')
# def customSearch():
#     return render_template('custom_search.html')

@app.route('/hotdeals')
def hotdeals():
    hot=master.nlargest(100,'discount')
    hot['itemid']=hot['itemid'].apply(getURL)
    hot['brandURL']=hot['brand'].map(getBrandItems)
    return jsonify(json.loads(hot.to_json(orient='records')))

@app.route("/prodlabel")
def getProdLabel():
    x=master['productname'].map(lambda x: " ".join(x.split(" ")[-2:]))
    out=[s_ for s_ in set(x)]
    return jsonify({"msg":"{0} labels found..".format(len(out)),"labels":out})

@app.route("/prodlabelall")
def getProdLabelAll():
    f=prdnmdf['productname'].dropna()
    x=f.map(lambda x: " ".join(x.split(" ")[-2:]))
    out=[s_ for s_ in set(x)]
    return jsonify({"labels":out})

@app.route('/stats')
def getCt():
    return jsonify({'ct':len(master)})

@app.route("/prodlabelitemid")
def getProdLabelitemid():
    master['lbl']=master['productname'].map(lambda x: " ".join(x.split(" ")[-2:]))
#    out=master.loc[:,['itemid','lbl']]
    out=master.groupby(by='lbl')['itemid'].min()
    out.reset_index()
    return jsonify(to_json(out.reset_index()))
    # out=[s_ for s_ in set(x)]
    # return jsonify({"msg":"{0} labels found..".format(len(out)),"labels":out})

# @app.route('/search')
# def search():
#     return render_template('search.html')

@app.route('/lessthan/<x>')
# def showlt50():
#     return jsonify({"message":len(lt50), "data":to_json(lt50)})
def showlt50(x):
    if '-' in pct:
        mn,mx=[int(x) for x in pct.split('-')]
        lt50out=lt50.loc[lt50['price'].between(mn,mx,inclusive=True)]
    else:
        lt50out=lt50.loc[lt50['price']<=int(x)]
    return jsonify({"data":to_json(lt50out)})


@app.route('/showSavings/<pct>/<minPrice>')
@app.route('/showSavings/<pct>')
def returnResult(pct,minPrice='9999999'):
    sortby=request.args.get('sortby',None)
    prdnamefilter=request.args.get('search',None)

    if sortby and sortby not in ['price','itemid','was','productname','savings','brand','category']:
        return 'SortBy param should be price / itemid / was / productname / brand / category'
    
    #result=master.loc[(df['savings']>=int(pct)) & (df['price'] <= int(minPrice)),:]
    if '-' in pct:
        mn,mx=[int(x) for x in pct.split('-')]
        if '-' in minPrice:    
            pmn,pmx=[int(x) for x in minPrice.split('-')]    
            result=master.loc[(df['savings'].between(mn,mx,inclusive=True)) & (df['price'].between(pmn,pmx,inclusive=True)),:]
        else:
            result=master.loc[(df['savings'].between(mn,mx,inclusive=True)) & (df['price'].le(int(minPrice))),:]
    else:
        #result=master.loc[(df['savings'].ge(int(pct))) & (df['price'] <= int(minPrice)),:]
        if '-' in minPrice:    
            pmn,pmx=[int(x) for x in minPrice.split('-')]    
            result=master.loc[(df['savings'].ge(int(pct))) & (df['price'].between(pmn,pmx,inclusive=True)),:]
        else:
            result=master.loc[(df['savings'].ge(int(pct))) & (df['price'].le(int(minPrice))),:]
    
    result['itemid']=result['itemid'].map(lambda x:getURL(x))

    if prdnamefilter:
        #result=result.loc[result['productname'].str.decode('utf-8').str.contains(prdnamefilter,regex=False,case=False) ,:]
        # Search only product name Ram
        #result=result.loc[(result['productname'].str.decode('utf-8').str.contains(prdnamefilter,regex=False,case=False)) 
        #| (result['brand'].str.decode('utf-8').str.contains(prdnamefilter,regex=False,case=False)),:]
        
        result=result.loc[(result['productname'].str.decode('utf-8').str.contains(prdnamefilter,regex=False,case=False)),:]

    #result=result.loc[:,['itemid','price','was','savings','brand','productname']]
    ct=len(result)    
    if sortby:
        result=result.sort_values(by=[sortby],kind='quicksort')
    
    lbl='Savings : '+pct+'% and Price : $'+str(minPrice) + ' - {0} records found'.format(str(ct)) if not prdnamefilter else 'Savings : '+pct+'% and Price : $'+str(minPrice) + ' and ProductName contains {1} - {0} records found'.format(str(ct),prdnamefilter)  
    result['brandURL']=result['brand'].map(getBrandItems)
    result['prodlbl']=result['productname'].map(lambda x: " ".join(x.split(" ")[-2:]))
    
    return jsonify({"message":lbl, "data":to_json(result)})

pd.set_option('display.max_colwidth', -1)
hme=os.path.join(os.curdir,'templates')
datahme=os.path.join(os.curdir,'data')
savings=os.path.join(datahme,'OnlineWas2PriceInventoryExtract.del')
prodname=os.path.join(datahme,'PRODUCT-NAME.del')
prodbrnd=os.path.join(datahme,'PRODUCT-BRAND.del')


df=pd.read_table(savings,sep='|',names=['itemid','price','was'])
#    prdnmdf=pd.read_table(prodname,sep='|',names=['itemid','guid','productname','usage','1','2','3'])
prdnmdf=pd.read_table(prodname,sep='|',names=['itemid','productname'])
prdbrnddf=pd.read_table(prodbrnd,sep='|',names=['itemid','brand'])

lt50=df.loc[df['price'].between(1,250,inclusive=True),:]
# lt50=lt50.join(prdnmdf.set_index('itemid'),on='itemid',rsuffix='_n')
# lt50=lt50.join(prdbrnddf.set_index('itemid'),on='itemid',rsuffix='_b')
# fillval={'productname':'Product_Name_Missing','brand':'Brand_Missing'}
# lt50=lt50.fillna(value=fillval)
lt50=lt50.sort_values(by=['price'],kind='quicksort')


# filer for values with was price
#df=df.loc[df['was'].isna()!=True,:]
df=df.dropna()

# fillval={'was':-1,'savings':111}
# df=df.fillna(value=fillval)

# df.loc[df['was']!=None,['was']]=df['price']

df['savings']=((df['was']-df['price'])/df['was']*100).round(2)    
df['discount']=(df['was']-df['price'])
df=df.join(prdnmdf.set_index('itemid'),on='itemid',rsuffix='_n')
df=df.join(prdbrnddf.set_index('itemid'),on='itemid',rsuffix='_b')

fillval={'productname':'Product_Name_Missing','brand':'Brand_Missing'}
#master=df.join(prdnmdf.set_index('itemid'),on='itemid',lsuffix='gs')
master=df.fillna(value=fillval)
priceBin=np.linspace(0,500,11)
priceBin.put(-1,9999999)


master=master.sort_values(by=['savings'],kind='quicksort')


#    byBrand=master.groupby(by='brand')['itemid'].count().to_frame().reset_index()
byBrand=master.groupby(by='brand')['itemid'].count().to_frame()
byBrand=byBrand.rename(columns={'itemid':'counts'})
brandmin=master.groupby(by='brand')['savings'].min()
brandmax=master.groupby(by='brand')['savings'].max()
brandminprc=master.groupby(by='brand')['price'].min()
brandmaxprc=master.groupby(by='brand')['price'].max()

byBrand['minSavings']=brandmin
byBrand['maxSavings']=brandmax   
byBrand['minPrice']=brandminprc
byBrand['maxPrice']=brandmaxprc 
byBrand=byBrand.reset_index()
byBrand['brandURL']=byBrand['brand'].map(lambda x:getBrandItems(x))

master['category']=pd.cut(master['price'],priceBin,labels=['$0 < $50','$50 < $100','$100 < $150','$150 < $200','$200 < $250','$250 < $300','$300 < $350','$350 < $400','$400 < $450','> $450'])
ByPriceRange=master.groupby('category')['itemid'].count().to_frame().reset_index()

#freqDist
o=[]
for x in master['productname'].str.decode('utf-8').str.lower():
    o+=nltk.wordpunct_tokenize(x) 

o=[x for x in o if len(x) >=3 ]    
prodnamefreqdist=nltk.FreqDist(o)
#freqdict={k:v for k,v prodnamefreqdist.iteritems()}    

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=os.getenv('PORT',5000),debug=False)
        # app.run(debug=False)