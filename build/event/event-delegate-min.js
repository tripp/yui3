YUI.add("event-delegate",function(G){var D=G.Array,B=G.Lang,A=B.isString,F=G.Selector.test,C=G.Env.evt.handles;function E(Q,S,J,I){var O=D(arguments,0,true),P=A(J)?J:null,N=Q.split(/\|/),L,H,K,R,M;if(N.length>1){R=N.shift();Q=N.shift();}L=G.Node.DOM_EVENTS[Q];if(B.isObject(L)&&L.delegate){M=L.delegate.apply(L,arguments);}if(!M){if(!Q||!S||!J||!I){return;}H=(P)?G.Selector.query(P,null,true):J;if(!H&&A(J)){M=G.on("available",function(){G.mix(M,G.delegate.apply(G,O),true);},J);}if(!M&&H){O.splice(2,2,H);if(A(I)){I=G.delegate.compileFilter(I);}M=G.on.apply(G,O);M.sub.getCurrentTarget=I;M.sub._notify=G.delegate.notifySub;}}if(M&&R){K=C[R]||(C[R]={});K=K[Q]||(K[Q]=[]);K.push(M);}return M;}E.notifySub=function(L,P,J){P=P.slice();if(this.args){P=P.push.apply(P,this.args);}var K=this.getCurrentTarget.apply(this,P),I=P[0],H=I.currentTarget,M,O,N;if(K){K=D(K);for(M=K.length-1;M>=0;--M){N=K[M];P[0]=new G.DOMEventFacade(I,N,J);P[0].container=H;L=this.context||N;O=this.fn.apply(L,P);if(O===false){break;}}return O;}};E.compileFilter=G.cached(function(H){return function(L){var I=L.currentTarget._node,K=L.target._node,J=[];while(K!==I){if(F(K,H,I)){J.push(G.one(K));}K=K.parentNode;}if(J.length<=1){J=J[0];}return J;};});G.delegate=G.Event.delegate=E;},"@VERSION@",{requires:["node-base"]});