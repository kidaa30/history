var commentsLoader = Class.create();
commentsLoader.settings = {
  url: 'Veuillez entrer une URL :',
  email: 'Veuillez entrer un e-mail :',
  error: 'Une erreur est survenue. Veuillez recommencer.'
};
commentsLoader.prototype = {
  initialize: function (init, settings) {
    if (init == undefined) return;
    this.settings = Object.extend(Object.extend({}, commentsLoader.settings), settings || {});
    switch (init.idAction) {
    case 0:
      Event.observe(window, 'load', function () {
        if ($('commentSubmiter')) {
          $('commentSubmiter').onclick = function () {
            this.postComment($('commentForm'), init.url, init.urlModale);
            return false;
          }.bind(this)
        }
      }.bind(this));
      break;
    case 1:
      commentsScriptLoading.initialize('bbcode');
     Event.observe(window, 'load', function () {
        this.document();
        if ($('commentSubmiter')) {
          $('commentSubmiter').onclick = function () {
            $('commentForm').insert('<input type="hidden" value="true" name="loosyCSRF" />');          
            $('commentForm').submit();
            $('commentSubmiter').hide();
            return false
          }.bind(this)
        }
      }.bind(this));
      break;
    case 2:
      Event.observe('myModal', 'load', this.modal());
      if ($('commentSubmiter')) {
        $('commentSubmiter').onclick = function () {
          this.postComment($('commentForm'), init.url, init.urlModale);
          return false
        }.bind(this)
      }
      break;
    default:
      alert(this.settings.error);
      return;
      break
    }
    if (init.idAction <= 1) {
      commentObject = new commentsPagination(init.idContentType, init.idContent, init.url, init.nbPages, init.options)
    }
  },
  document: function () {
    var formId = ($('news_commentaires') == undefined) ? 'commentForm' : 'news_commentaires';
    new BBCode(formId, 'default', {
      url: this.settings.url,
      email: this.settings.email,
      error: this.settings.error
    });
    $('plus').onclick = function () {
      this.color('#eaefeb', 'noteCommentPlus')
    }.bind(this);
    $('zero').onclick = function () {
      this.color('#fff', 'noteCommentZero')
    }.bind(this);
    $('moins').onclick = function () {
      this.color('#f5ecec', 'noteCommentMoins')
    }.bind(this)
  },
  modal: function () {
    this.document();
    (notation != undefined && notation == 'plus') ? this.color('#eaefeb', 'noteCommentPlus') : this.color('#f5ecec', 'noteCommentMoins')
  },
  postComment: function (formulaire, url, urlModale) {
    $('commentSubmiter').hide();
    var inputLoosy = new Element('input',{ 'type':'hidden', 'value': 'true' });
    inputLoosy.writeAttribute('name','loosyCSRF');
    $('commentForm').insert(inputLoosy);
    if (!$('myModal')) {
      if ($('commentaire2').value) return false;
      if (this.formError() == true) return
    }
    if (membreIdentifie == undefined || membreIdentifie == 0) {
      viewModal(urlModale, true);
      oPe = new PeriodicalExecuter(function (pe) {
        if ($('myModal') == undefined) {
          $('commentSubmiter').show();
          pe.stop()
        }
      }.bind(this), 1);
      return false
    }
    var options = {
      method: 'post',
      parameters: Form.serialize(formulaire),
      onComplete: function (obj) {
        (!$('myModal')) ? this.showError(false, obj) : this.modalPostComment(obj)
      }.bind(this),
      asynchronous: false,
      encoding: 'utf-8'
    };
    var req = new Ajax.Request(url, options);
    return false
  },
  modalPostComment: function (obj) {
    $('myModal-content').update(obj.responseText);
    modal.prototype.position()
  },
  formError: function () {
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var error = '';
    if ($('anonyme') == undefined || $('anonyme').value == 0) {
      if ($('pseudo') && $('pseudo').value.length <= 2) {
        error = 6
      } else if ($('email') && $('email').value.length <= 1) {
        error = 7
      } else if ($('email') && emailRegex.test($('email').value) == false) {
        error = 4
      }
    }
    if ($('commentaire') && $('commentaire').value.length <= 1) {
      error = 8
    }
    if (error == '') {
      return false
    } else {
      this.showError(error, false);
      return true
    }
  },
  showError: function (formError, obj) {
    if (formError) {
      var reponseErreur = formError
    } else {
      var reponse = obj.responseText.evalJSON();
      var reponseErreur = reponse.erreur;
      if (reponse.page != null) {
        $('commentaire').value = '';
        if (!$('commentsBox')) {
          self.location = self.location;
          return true
        } else {
          var page = (parseInt(reponse.page) - 1 >= 0) ? (parseInt(reponse.page) - 1) : 0;
          commentObject.gotoPage(null, page)
        }
        return true
      }
    }
    if (reponseErreur) {
      if ($('anonyme') != undefined && $('anonyme').value == 0) {
        oPe.stop();
        $('commentSubmiter').hide()
      }
      new Effect.Appear('comment-error-' + reponseErreur, {
        duration: 0.5,
        afterFinish: function () {
          setTimeout('new Effect.Fade(\'comment-error-' + reponseErreur + '\', { duration : 0.5 });', 3000);
          setTimeout('$(\'commentSubmiter\').style.display = \'block\';', 3500)
        }
      });
      return false
    }
    return true
  },
  color: function (color, id) {
    $('commentaire').style.background = color;
    $(id).checked = 'checked';
    return true
  },
  validModalAnonyme: function () {
    $('pseudo').value = $('myInsc_login').value;
    $('email').value = $('myInsc_email').value;
    $('anonyme').value = 0;
    var url = $('modalAnonyme').action;
    modal.prototype.hideModal();
    var options = {
      method: 'post',
      parameters: Form.serialize($('commentForm')),
      asynchronous: false,
      encoding: 'utf-8',
      onComplete: function (obj) {
        if (false == commentsLoader.prototype.formError()) {
          commentsLoader.prototype.showError(false, obj)
        }
      }
    };
    var req = new Ajax.Request(url, options);
    $('anonyme').value = 1;
    return false
  }
};
var commentsScriptLoading = {
  initialize: function (script, onlyMembers) {
    if (!script || script == '') return;
    if (onlyMembers && onlyMembers == true && (!membreIdentifie || membreIdentifie != 1)) return;
    script = script.replace(' ', '');
    var regex = new RegExp(',', 'g');
    var includes = script.split(regex);
    var domain = window.document.domain;
    var tld = (domain.search('.lan') == -1) ? 'com' : 'lan';
    for (x = 0; x < includes.length; x++) {
      document.write('<script type="text/javascript" src="http://m.bestofmedia.' + tld + '/s/commun/js/framework/comments/' + includes[x] + '.js?16032009"><\/script>')
    }
  }
};
var commentsPagination = Class.create();
commentsPagination.prototype = {
  options: {
    encoding: 'utf-8',
    idCommentsBlock: 'commentsConteneur',
    classPaginationBlock: 'paginationComments',
    ajaxLoader: 'http://m.bestofmedia.com/i/commun/ajax-loader.gif',
    idOverlay: 'commentsOverlay'
  },
  initialize: function (idContentType, idContent, urlRequest, nbPages, options) {
    this.idContentType = idContentType;
    this.idContent = idContent;
    this.urlRequest = urlRequest;
    this.options = Object.extend(this.options, options);
    this.url = document.URL;
    this.actualPage = 0;
    this.nbPages = nbPages;
    if (this.url.indexOf('#BOM_comments') != -1 && this.nbPages > 1) {
      var height = $(this.options.idCommentsBlock).getHeight();
      $(this.options.idOverlay).style.height = height + 'px';
      $(this.options.idOverlay).show();
      this.gotoPage(null, this.nbPages - 1)
    }
    this.zones = $A(document.getElementsByClassName(this.options.classPaginationBlock));
    this.zones.each(function (zone) {
      zone.getElementsByClassName('next')[0].onclick = function () {
        return this.gotoPage(null, 1)
      }.bindAsEventListener(this);
      zone.getElementsByClassName('last')[0].onclick = function () {
        return this.gotoPage(null, this.nbPages - 1)
      }.bindAsEventListener(this)
    }.bind(this))
  },
  loadPage: function (index) {
    var height = $(this.options.idCommentsBlock).getHeight();
    $(this.options.idOverlay).style.height = height + 'px';
    $(this.options.idOverlay).show();
    var urlBase = 'action=get_page&idContentType=' + this.idContentType + '&idContent=' + this.idContent + '&page=' + index;
    var url = this.options.idSiteOrigine ? urlBase + '&idSiteOrigine=' + this.options.idSiteOrigine : urlBase;
    var options = {
      method: 'post',
      parameters: url,
      onComplete: function (obj) {
        $(this.options.idCommentsBlock).update(obj.responseText);
        this.updatePagination(index);
        commentsSortableObj.updater()
      }.bind(this),
      asynchronous: true,
      encoding: this.options.encoding
    };
    new Ajax.Request(this.urlRequest, options)
  },
  updatePagination: function (index) {
    if (index > this.nbPages) {
      this.nbPages = index
    }
    this.actualPage = index;
    this.zones.each(function (zone) {
      if (this.actualPage > 0) {
        zone.getElementsByClassName('first')[0].onclick = function () {
          return this.gotoPage(null, 0)
        }.bindAsEventListener(this);
        zone.getElementsByClassName('prev')[0].onclick = function () {
          return this.gotoPage(null, this.actualPage - 1)
        }.bindAsEventListener(this);
        zone.getElementsByClassName('first')[0].show();
        zone.getElementsByClassName('prev')[0].show()
      } else {
        zone.getElementsByClassName('first')[0].hide();
        zone.getElementsByClassName('prev')[0].hide()
      }
      if (this.actualPage < this.nbPages - 1) {
        zone.getElementsByClassName('last')[0].onclick = function () {
          return this.gotoPage(null, this.nbPages - 1)
        }.bindAsEventListener(this);
        zone.getElementsByClassName('next')[0].onclick = function () {
          return this.gotoPage(null, this.actualPage + 1)
        }.bindAsEventListener(this);
        zone.getElementsByClassName('last')[0].show();
        zone.getElementsByClassName('next')[0].show()
      } else {
        zone.getElementsByClassName('last')[0].hide();
        zone.getElementsByClassName('next')[0].hide()
      }
      zone.getElementsByClassName('comments-actualPage')[0].update(this.actualPage + 1)
    }.bind(this));
    $(this.options.idOverlay).hide();
    if (parseFloat(Prototype.Version) >= 1.6) {
      $(this.options.idCommentsBlock).fire('comments:pagination')
    }
  },
  gotoPage: function (e, index, dontScrollTo) {
    this.loadPage(index);
    if (e) Event.stop(e);
    if (dontScrollTo) return false;
    $('commentsBox').scrollTo();
    return false
  }
};
var commentsSortable = Class.create();
commentsSortable.prototype = {
  initialize: function (e) {
    if (e == undefined) return;
    this.masquer = e.masquer;
    this.afficher = e.afficher;
    this.forum = ($('mesdiscussions')) ? true : false;
    this.showDefaultComments = -3;
    this.showAllComments = 'all';
    this.showGoodComments = 1;
    this.showPoorComments = -9;
    this.events()
  },
  sortable: function (e) {
    var elm = e.elm;
    var nbr = e.nbr;
    var container = (this.forum) ? 'mesdiscussions' : 'commentsConteneur';
    $('showComments').getElementsBySelector('a').each(function (z) {
      z.className = (z.innerHTML == elm.innerHTML) ? 'current' : ''
    });
    $A($(container).getElementsByClassName('noteComment')).each(function (z) {
      var idComment = (this.forum) ? z.up('table') : z.up('div', 3);
      if (z.innerHTML >= nbr || nbr == 'all') {
        $(idComment).getElementsByClassName('displayComment')[0].update(this.masquer);
        $A($(idComment).getElementsByClassName('commentStatus')).each(function (s) {
          s.show()
        })
      } else {
        $(idComment).getElementsByClassName('displayComment')[0].update(this.afficher);
        $A($(idComment).getElementsByClassName('commentStatus')).each(function (s) {
          s.hide()
        })
      }
    }.bind(this))
  },
  status: function (e) {
    var elm = e.elm;
    var idComment = $(e.id);
    elm.innerHTML = (elm.innerHTML.replace(/(^\s*)|(\s*$)/g, '') == this.afficher) ? this.masquer : this.afficher;
    $A($(idComment).getElementsByClassName('commentStatus')).each(function (elm) {
      (elm.style.display == 'none') ? elm.show() : elm.hide()
    }.bind(this));
    return false
  },
  events: function () {
    if ($('showComments')) {
      $('defaultComments').onclick = function () {
        commentsSortableObj.sortable({
          nbr: this.showDefaultComments,
          elm: $('defaultComments')
        })
      }.bind(this);
      $('allComments').onclick = function () {
        commentsSortableObj.sortable({
          nbr: this.showAllComments,
          elm: $('allComments')
        })
      }.bind(this);
      $('goodComments').onclick = function () {
        commentsSortableObj.sortable({
          nbr: this.showGoodComments,
          elm: $('goodComments')
        })
      }.bind(this);
      $('poorComments').onclick = function () {
        commentsSortableObj.sortable({
          nbr: this.showPoorComments,
          elm: $('poorComments')
        })
      }.bind(this)
    }
  },
  updater: function () {
    $('showComments').getElementsBySelector('a').each(function (e) {
      if (e.hasClassName('current')) {
        var nbr = '';
        switch (e.id) {
        case 'defaultComments':
          nbr = this.showDefaultComments;
          break;
        case 'allComments':
          nbr = this.showAllComments;
          break;
        case 'goodComments':
          nbr = this.showGoodComments;
          break;
        case 'poorComments':
          nbr = this.showPoorComments;
          break;
        default:
          return;
          break
        }
        commentsSortableObj.sortable({
          nbr: nbr,
          elm: $(e.id)
        })
      }
    }.bind(this))
  }
};
var commentsNotation = Class.create();
commentsNotation.prototype = {
  initialize: function (init) {
    if (init == undefined) {
      return false
    }
    this.id = init.id;
    this.done = init.done;
    this.error = init.error;
    var noteComment = $('theMessage' + this.id).getElementsByClassName('noteComment')[0];
    var notation = parseInt(noteComment.innerHTML) + ((init.note == '-1') ? -1 : 1);
    this.actualNote = noteComment.innerHTML;
    var bind = this;
    var maxPlus = 20;
    var maxMinus = -20;
    var options = {
      method: 'post',
      onCreate: function () {
        noteComment.innerHTML = '';
        noteComment.style.background = 'transparent url(\'http://m.bestofmedia.com/i/tomsguide/design/ajax-loaderNano.gif\') top left no-repeat';
        noteComment.style.width = '16px';
        noteComment.style.height = '16px';
        noteComment.style.marginTop = '3px'
      },
      onComplete: function (obj) {
        if (obj.responseText == '[KO]') {
          bind.reinitialize(noteComment)
        } else {
          noteComment.style.color = (notation == 0) ? 'black' : ((notation > 0) ? 'green' : 'red');
          notation = (notation > maxPlus) ? maxPlus : ((notation < maxMinus) ? maxMinus : notation);
          noteComment.innerHTML = notation;
          noteComment.style.background = 'none';
          noteComment.style.marginTop = '0';
          bind.disable()
        }
      },
      asynchronous: true,
      encoding: 'utf-8'
    };
    new Ajax.Request(init.request, options)
  },
  reinitialize: function (elm) {
    elm.innerHTML = this.actualNote;
    elm.style.background = 'none';
    elm.style.marginTop = '0';
    alert(this.done)
  },
  disable: function () {
    var classNames = ['bt-plus', 'bt-minus'];
    for (var x = 0; x < classNames.length; x++) {
      var link = $('theMessage' + this.id).getElementsByClassName(classNames[x])[0];
      link.className = classNames[x] + '-blocked';
      link.href = 'javascript: void(0);';
      link.title = this.done.unescapeHTML()
    }
  }
};