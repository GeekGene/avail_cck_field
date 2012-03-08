if( !this._k )
{
	_k = function( obj )
	{
		while( obj.childNodes && obj.childNodes.length > 0 )
			obj.removeChild( obj.childNodes[0] );
		return obj;
	}
}

if( !this.GGAvailGridLookup )
{
	GGAvailGridLookup = {};
	GGAvailGridLookupId=0;
}

if( !this.GGAvailGrid )
{
	GGAvailGridCheck = function()
	{
		this.checked = false;
		this.td = null;
	}

	GGAvailGrid = function()
	{
		this.data = null;
		this.curData = '';
		this.elem = null;
		this.imgPath = '';
		this.readOnly = false;
		this.checks = [];
		this.hChecks = {};

		this.imgNo = null;
		this.imgYes = null;

		this.addCell = function(p)
		{
			var tcell = document.createElement("td");
			tcell.style.paddingTop=0;
			tcell.style.paddingRight=0;
			tcell.style.paddingBottom=0;
			tcell.style.paddingLeft=0;
			p.appendChild(tcell);
			return tcell;
		}

		this.addBut = function(p,txt)
		{
			if( this.readOnly )
			{
				var but = document.createElement("div");
				but.style.textAlign="center";
				if( this.readOnly )
				{
					but.style.width="32px";
					but.style.height="16px";
				}
				else
				{
					but.style.width="64px";
					but.style.height="32px";
				}
				but.appendChild( document.createTextNode( txt ) );
				p.appendChild(but);
				return but;
			}
			else
			{
				var but = document.createElement("input");
				but.type="button";
				but.value=txt;
				if( this.readOnly )
				{
					but.style.width="32px";
					but.style.height="16px";
				}
				else
				{
					but.style.width="64px";
					but.style.height="32px";
				}
				p.appendChild(but);
				return but;
			}
		}

		this.init = function( _data, _elem, _imgPath, _readOnly )
		{
			this.data = _data;
			if( this.data.value )
				this.curData = this.data.value;
			else
				this.curData = this.data;
			this.elem = _elem;
			this.imgPath = _imgPath;
			if( _readOnly )
				this.readOnly = true;
			_k( this.elem );

			this.imgNo = new Image();
			if( this.readOnly )
				this.imgNo.src = this.imgPath+"noavail_sm.png";
			else
				this.imgNo.src = this.imgPath+"noavail.png";
			this.imgYes = new Image();
			if( this.readOnly )
				this.imgYes.src = this.imgPath+"avail_sm.png";
			else
				this.imgYes.src = this.imgPath+"avail.png";

			var tbl = document.createElement("table");
			tbl.style.width="0px";
			this.elem.appendChild(tbl);
			var tbody = document.createElement("tbody");
			tbl.appendChild(tbody);
			var trow = document.createElement("tr");
			tbody.appendChild(trow);
			var tcell = null;
			if( !this.readOnly )
			{
				tcell = this.addCell(trow);
				var but = null;
				but = this.addBut(tcell,"Select All");
				but.style.width="128px";
				this.bindSelect(but);
			}
			tcell = this.addCell(trow);
			this.bindSelect(this.addBut(tcell,"Mon"));
			tcell = this.addCell(trow);
			this.bindSelect(this.addBut(tcell,"Tue"));
			tcell = this.addCell(trow);
			this.bindSelect(this.addBut(tcell,"Wed"));
			tcell = this.addCell(trow);
			this.bindSelect(this.addBut(tcell,"Thu"));
			tcell = this.addCell(trow);
			this.bindSelect(this.addBut(tcell,"Fri"));
			tcell = this.addCell(trow);
			this.bindSelect(this.addBut(tcell,"Sat"));
			tcell = this.addCell(trow);
			this.bindSelect(this.addBut(tcell,"Sun"));
			var trow = document.createElement("tr");
			tbody.appendChild(trow);
			if( !this.readOnly )
			{
				tcell = this.addCell(trow);
				but = this.addBut(tcell,"Morning");
				but.style.width="128px";
				this.bindSelect(but);
			}

			for( var i=0; i<21; ++i )
			{
				if( i%7==0&&i!=0 )
				{
					trow = document.createElement("tr");
					tbody.appendChild(trow);
					if( !this.readOnly )
					{
						tcell = this.addCell(trow);
						if( i==7 )
						{
							but = this.addBut(tcell,"Afternoon");
							but.style.width="128px";
							this.bindSelect(but);
						}
						else
						{
							but = this.addBut(tcell,"Evening");
							but.style.width="128px";
							this.bindSelect(but);
						}
					}
				}

				var chk = new GGAvailGridCheck();
				chk.td = this.addCell(trow);
				if( this.readOnly )
				{
					chk.td.style.width="32px";
					chk.td.style.height="16px";
				}
				else
				{
					chk.td.style.width="64px";
					chk.td.style.height="32px";
				}
				chk.td.appendChild(document.createTextNode(" "));
				chk.td.style.backgroundImage="url('"+this.imgNo.src+"')";
				if( !this.readOnly )
					chk.td.style.cursor="pointer";

				this.checks.push( chk );
				if( this.curData.length>i
						&& this.curData[i]=="1" )
				{
					chk.checked = true;
					chk.td.style.backgroundImage="url('"+this.imgYes.src+"')";
				}
				this.bindMain(chk.td);
				this.hChecks[chk.td.id] = chk;
			}
		}

		this.refreshData = function( imgAlso )
		{
			var sOut = "";
			for( var idx in this.checks )
			{
				var c = this.checks[idx];
				if( c.checked )
					sOut+="1";
				else
					sOut+="0";
				if( imgAlso == true )
				{
					if( c.checked )
						c.td.style.backgroundImage="url('"+this.imgYes.src+"')";
					else
						c.td.style.backgroundImage="url('"+this.imgNo.src+"')";
				}
			}
			this.data.value = sOut;
			this.curData = sOut;
		}

		this.changeAvail = function( elem )
		{
			var chk = this.hChecks[elem.id];
			chk.checked = !chk.checked;
			if( chk.checked )
				chk.td.style.backgroundImage="url('"+this.imgYes.src+"')";
			else
				chk.td.style.backgroundImage="url('"+this.imgNo.src+"')";
			this.refreshData( false );
		}

		this.changeSelect = function( elem )
		{
			var val = "                     ";
			switch( elem.value )
			{
				case "Select All":
					val = "111111111111111111111";
					elem.value = "Select None";
					break;
				case "Select None":
					val = "000000000000000000000";
					elem.value = "Select All";
					break;
				case "Morning":
					val = "XXXXXXX              ";
					break;
				case "Afternoon":
					val = "       XXXXXXX       ";
					break;
				case "Evening":
					val = "              XXXXXXX";
					break;
				case "Mon":
					val = "X      X      X      ";
					break;
				case "Tue":
					val = " X      X      X     ";
					break;
				case "Wed":
					val = "  X      X      X    ";
					break;
				case "Thu":
					val = "   X      X      X   ";
					break;
				case "Fri":
					val = "    X      X      X  ";
					break;
				case "Sat":
					val = "     X      X      X ";
					break;
				case "Sun":
					val = "      X      X      X";
					break;
			}
			var t=0;
			var j=0;
			for( var i=0; i<val.length; ++i )
			{
				if( val[i]=="X" )
				{
					++t;
					if( this.checks.length>i &&
							this.checks[i].checked )
						++j;
				}
			}
			for( var i=0; i<val.length; ++i )
			{
				if( this.checks.length>i )
				{
					var c = this.checks[i];
					if(val[i]=="1")
						c.checked=true;
					else if( val[i]=="0" )
						c.checked=false;
					else if( val[i]=="X" )
					{
						if( t==j )
							c.checked=false;
						else
							c.checked=true;
					}
				}
			}
			this.refreshData(true);
		}

		this._id = function( theElem )
		{
			theElem.id = "GGAvailGridId"+(GGAvailGridLookupId++);
			GGAvailGridLookup[theElem.id]=this;
		}

		this.bindMain = function( theElem )
		{
			if( this.readOnly )
				return;
			this._id( theElem );
			this._bind( theElem, "click", function(ev)
			{
				ev = ev || window.event;
				var target = ev.target || ev.srcElement || document;

				var aGrid = GGAvailGridLookup[target.id];
				while( !aGrid )
				{
					target = target.parentNode;
					aGrid = GGAvailGridLookup[target.id];
				}
				aGrid.changeAvail(target);
			} );
		}

		this.bindSelect = function( theElem )
		{
			if( this.readOnly )
				return;
			this._id( theElem );
			this._bind( theElem, "click", function(ev)
			{
				ev = ev || window.event;
				var target = ev.target || ev.srcElement || document;

				var aGrid = GGAvailGridLookup[target.id];
				while( !aGrid )
				{
					target = target.parentNode;
					aGrid = GGAvailGridLookup[target.id];
				}
				aGrid.changeSelect(target);
			} );
		}

		this._bind = function( theElem, type, fn )
		{
			if (theElem.addEventListener)
				theElem.addEventListener(type, fn, false);
			else if (theElem.attachEvent)
				theElem.attachEvent("on" + type, fn);
		}
	}
}

